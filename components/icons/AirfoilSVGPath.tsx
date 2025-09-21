
import React from 'react';

interface AirfoilSVGPathProps {
    airfoil: string;
}

// Pre-calculated SVG paths for common airfoils
const AIRFOIL_PATHS: Record<string, string> = {
    'NACA 0012': "M1 0 C0.8 0.05, 0.6 0.09, 0.4 0.11 C0.2 0.12, 0 0.1, 0 0 C0 -0.1, 0.2 -0.12, 0.4 -0.11 C0.6 -0.09, 0.8 -0.05, 1 0 Z",
    'NACA 2412': "M1 0 C0.8 0.04, 0.6 0.08, 0.4 0.1 C0.2 0.09, 0 0.05, 0 0 C0 -0.05, 0.2 -0.08, 0.4 -0.07 C0.6 -0.06, 0.8 -0.03, 1 0 Z",
    'NACA 4415': "M1 0 C0.8 0.02, 0.6 0.06, 0.4 0.09 C0.2 0.08, 0 0.03, 0 0 C0 -0.04, 0.2 -0.07, 0.4 -0.06 C0.6 -0.04, 0.8 -0.01, 1 0 Z",
    'Clark Y': "M1 0 C0.8 0.03, 0.6 0.07, 0.4 0.09 C0.2 0.08, 0 0.04, 0 0 C0 -0.06, 0.2 -0.09, 0.4 -0.08 C0.6 -0.06, 0.8 -0.02, 1 0 Z"
};

export const AirfoilSVGPath: React.FC<AirfoilSVGPathProps> = ({ airfoil }) => {
    const pathData = AIRFOIL_PATHS[airfoil] || AIRFOIL_PATHS['NACA 0012'];

    return (
        <path
            d={pathData}
            fill="url(#wallGradient)"
            stroke="#94a3b8"
            strokeWidth="0.01"
            transform="scale(100, 100) translate(-0.5, 0)"
        />
    );
};
