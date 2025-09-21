
import { GoogleGenAI, Type } from "@google/genai";
import type { SimulationParams, AnalysisResult } from '../types';
import { FLUID_PROPERTIES } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { 
            type: Type.STRING,
            description: "Akışın genel davranışını, önemli bölgeleri (ayrılma, resirkülasyon, şoklar vb.) ve genel bulguları özetleyen, Türkçe dilinde, ayrıntılı bir paragraf."
        },
        flowPattern: {
            type: Type.STRING,
            description: "Akışın türünü belirten kısa bir etiket (Örn: Laminer, Geçiş, Türbülanslı, Ses Altı, Ses Üstü). Türkçe olmalı."
        },
        keyMetrics: {
            type: Type.ARRAY,
            description: "Hesaplanan önemli sayısal metriklerin bir listesi. Türkçe olmalı.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Metriğin adı (Örn: Basınç Düşüşü, Sürtünme Katsayısı, Kaldırma Kuvveti). Türkçe olmalı." },
                    value: { type: Type.STRING, description: "Metriğin sayısal değeri (bilimsel gösterim olmadan)." },
                    unit: { type: Type.STRING, description: "Metriğin birimi (Örn: Pa, N, m/s)." },
                },
                propertyOrdering: ["name", "value", "unit"],
            }
        },
        visualizationHint: {
            type: Type.OBJECT,
            description: "Sonuçların görselleştirilmesine yardımcı olacak veriler.",
            properties: {
                description: {
                    type: Type.STRING,
                    description: "Görselleştirmede neyin gösterilmesi gerektiğini açıklayan kısa bir metin. Örneğin, 'Boru merkezinde yüksek hız, duvarlarda düşük hız.' Türkçe olmalı."
                },
                pressurePoints: {
                    type: Type.ARRAY,
                    description: "Geometri boyunca normalize edilmiş (0-1 aralığında) koordinatlarda kilit basınç noktaları.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            value: { type: Type.NUMBER, description: "Normalize edilmiş basınç değeri (0: en düşük, 1: en yüksek)" }
                        }
                    }
                },
                velocityVectors: {
                    type: Type.ARRAY,
                    description: "Akış alanını temsil eden normalize edilmiş (0-1 aralığında) konumlardaki hız vektörleri.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            magnitude: { type: Type.NUMBER, description: "Normalize edilmiş hız büyüklüğü (0: en düşük, 1: en yüksek)" },
                            angle: { type: Type.NUMBER, description: "Radyan cinsinden vektör açısı" }
                        }
                    }
                }
            }
        }
    },
    propertyOrdering: ["summary", "flowPattern", "keyMetrics", "visualizationHint"],
};


function createPrompt(params: SimulationParams): string {
    const fluidProps = FLUID_PROPERTIES[params.fluid];
    const reynoldsNumber = (fluidProps.density * params.boundaryConditions.inletVelocity * (params.geometry.diameter || params.geometry.height)) / fluidProps.viscosity;

    let geometryDescription = '';
    switch(params.geometry.type) {
        case 'Dairesel Boru':
            geometryDescription = `bir dairesel boru. Borunun uzunluğu ${params.geometry.length} metre ve çapı ${params.geometry.diameter} metredir.`;
            break;
        case 'Dikdörtgen Kanal':
            geometryDescription = `bir dikdörtgen kanal. Kanalın uzunluğu ${params.geometry.length} metre, genişliği ${params.geometry.width} metre ve yüksekliği ${params.geometry.height} metredir.`;
            break;
        case 'Kanat Profili':
            geometryDescription = `bir ${params.geometry.airfoil} kanat profili etrafındaki akış. Hücum açısı 0 derece kabul edilsin.`;
            break;
    }

    return `
    Bir hesaplamalı akışkanlar dinamiği (HAD) uzmanı olarak davran. Aşağıdaki parametrelere göre bir akış analizi simülasyonu gerçekleştir ve sonuçları Türkçe olarak, belirtilen JSON şemasına uygun şekilde döndür.

    **Simülasyon Kurulumu:**

    1.  **Geometri:** Analiz, ${geometryDescription}
    2.  **Akışkan:** ${params.fluid}
        *   Yoğunluk: ${fluidProps.density} kg/m³
        *   Viskozite: ${fluidProps.viscosity} Pa·s
    3.  **Sınır Koşulları:**
        *   Giriş Hızı: ${params.boundaryConditions.inletVelocity} m/s
        *   Çıkış Basıncı: ${params.boundaryConditions.outletPressure} Pa (atmosfer basıncı)
        *   Sıcaklık: ${params.boundaryConditions.temperature}°C
    4.  **Hesaplanan Reynolds Sayısı:** Yaklaşık ${reynoldsNumber.toFixed(0)}. Bu sayıyı kullanarak akış rejimini (laminer, türbülanslı) belirle.

    **İstenen Çıktılar:**

    Lütfen aşağıdaki bilgileri içeren detaylı bir analiz sun:
    -   **Özet:** Akış davranışının nitel bir açıklaması. Akışın nasıl geliştiğini, basınç ve hız dağılımlarını, olası akış ayrılmalarını, girdapları veya türbülanslı bölgeleri açıkla.
    -   **Akış Deseni:** Reynolds sayısına ve geometriye dayanarak akışın laminer mi, türbülanslı mı yoksa geçiş rejiminde mi olduğunu belirt.
    -   **Anahtar Metrikler:**
        *   Boru/Kanal için: Basınç Düşüşü (Pa), Duvar Kayma Gerilmesi (Pa).
        *   Kanat Profili için: Kaldırma Katsayısı (Cl), Sürükleme Katsayısı (Cd).
    -   **Görselleştirme İpuçları:** Sonuçları basit bir 2D grafikte çizebilmek için normalize edilmiş (0'dan 1'e) koordinatlarda basınç ve hız verileri sağla.

    Analizini yap ve sonuçları JSON formatında döndür.
    `;
}

export const performAnalysis = async (params: SimulationParams): Promise<AnalysisResult> => {
    try {
        const prompt = createPrompt(params);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        return result as AnalysisResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('API_KEY')) {
             throw new Error("Gemini API key is not configured or invalid. Please set the API_KEY environment variable.");
        }
        throw new Error("Failed to get analysis from AI. The model may have returned an invalid format.");
    }
};
