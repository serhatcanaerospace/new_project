
import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultsPanelProps {
    result: AnalysisResult | null;
    isLoading: boolean;
    error: string | null;
}

const LoadingState: React.FC = () => (
    <div className="p-6 text-center">
        <div className="flex justify-center items-center mb-4">
            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <p className="text-lg font-semibold text-gray-300">AI Simülasyonu Çalıştırılıyor...</p>
        <p className="text-sm text-gray-500 mt-1">Bu işlem biraz zaman alabilir. Lütfen bekleyin.</p>
    </div>
);

const InitialState: React.FC = () => (
    <div className="p-6 text-center">
        <p className="text-gray-400">Analiz sonuçları burada gösterilecektir.</p>
        <p className="text-sm text-gray-500 mt-1">Parametreleri ayarlayın ve 'Analizi Başlat' düğmesine tıklayın.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
     <div className="p-6 text-center bg-red-900/20 border border-red-500/30 rounded-lg m-4">
        <h3 className="font-semibold text-red-400">Analiz Başarısız Oldu</h3>
        <p className="text-sm text-red-300/80 mt-2 whitespace-pre-wrap">{message}</p>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, isLoading, error }) => {
    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState message={error} />;
        if (!result) return <InitialState />;

        return (
            <div className="p-4 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Özet</h3>
                    <p className="text-sm text-gray-300 leading-relaxed bg-slate-800/50 p-3 rounded-md">{result.summary}</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Akış Deseni</h3>
                    <p className="text-lg font-bold text-gray-100 bg-slate-800/50 p-3 rounded-md inline-block">{result.flowPattern}</p>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3">Anahtar Metrikler</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-slate-700">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Metrik</th>
                                    <th scope="col" className="px-4 py-2 text-right">Değer</th>
                                    <th scope="col" className="px-4 py-2">Birim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.keyMetrics.map((metric, index) => (
                                    <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                        <th scope="row" className="px-4 py-2 font-medium text-gray-200 whitespace-nowrap">{metric.name}</th>
                                        <td className="px-4 py-2 text-right font-mono">{metric.value}</td>
                                        <td className="px-4 py-2">{metric.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-64 min-h-[16rem] bg-slate-800/70 border-t border-slate-700 overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 p-2 z-10 border-b border-slate-700">
                <h2 className="text-base font-semibold text-gray-200">Analiz Sonuçları</h2>
            </div>
            {renderContent()}
        </div>
    );
};
