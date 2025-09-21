
export enum GeometryType {
  PIPE = 'Dairesel Boru',
  CHANNEL = 'Dikdörtgen Kanal',
  AIRFOIL = 'Kanat Profili',
}

export enum FluidType {
    WATER = 'Su',
    AIR = 'Hava',
    OIL = 'Yağ (SAE 30)',
}

export interface GeometryParams {
    type: GeometryType;
    length: number;
    diameter: number;
    width: number;
    height: number;
    airfoil: string;
}

export interface BoundaryConditions {
    inletVelocity: number; // m/s
    outletPressure: number; // Pa
    temperature: number; // Celsius
}

export interface SimulationParams {
    geometry: GeometryParams;
    fluid: FluidType;
    boundaryConditions: BoundaryConditions;
}

export interface KeyMetric {
    name: string;
    value: string;
    unit: string;
}

export interface AnalysisResult {
    summary: string;
    flowPattern: string;
    keyMetrics: KeyMetric[];
    visualizationHint: {
        description: string;
        pressurePoints: {x: number; y: number; value: number}[];
        velocityVectors: {x: number; y: number; magnitude: number; angle: number}[];
    }
}
