
import { FluidType } from "./types";

interface FluidProperties {
    density: number; // kg/m^3
    viscosity: number; // Pa·s
}

export const FLUID_PROPERTIES: Record<FluidType, FluidProperties> = {
    [FluidType.WATER]: { density: 998.2, viscosity: 0.001002 },
    [FluidType.AIR]: { density: 1.225, viscosity: 0.0000181 },
    [FluidType.OIL]: { density: 891, viscosity: 0.29 },
};

export const AIRFOIL_TYPES: string[] = [
    'NACA 0012',
    'NACA 2412',
    'NACA 4415',
    'Clark Y',
];
