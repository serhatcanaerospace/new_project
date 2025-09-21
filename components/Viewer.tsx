
import React from 'react';
import type { SimulationParams, AnalysisResult } from '../types';
import { GeometryType } from '../types';
import { AirfoilSVGPath } from './icons/AirfoilSVGPath';

interface ViewerProps {
    params: SimulationParams;
    result: AnalysisResult | null;
}

const GeometryDisplay: React.FC<{ params: SimulationParams }> = ({ params }) => {
    const { type, length, diameter, width, height, airfoil } = params.geometry;
    const aspectRatio = type === GeometryType.PIPE ? length / diameter : length / height;

    return (
        <svg viewBox={`0 0 ${100 * Math.max(1, aspectRatio)} 100`} className="w-full h-full">
            <defs>
                <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
            </defs>

            {/* Inlet Arrow */}
            <line x1="5" y1="50" x2="25" y2="50" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="15" y="45" fill="#06b6d4" fontSize="6" textAnchor="middle">Giriş</text>

            {type === GeometryType.PIPE && (
                <>
                    <rect x="20" y="35" width={100 * aspectRatio} height="30" fill="url(#wallGradient)" />
                    <line x1="20" y1="35" x2={20 + 100 * aspectRatio} y2="35" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="20" y1="65" x2={20 + 100 * aspectRatio} y2="65" stroke="#94a3b8" strokeWidth="1" />
                </>
            )}

            {type === GeometryType.CHANNEL && (
                 <>
                    <rect x="20" y="35" width={100 * aspectRatio} height="30" fill="url(#wallGradient)" />
                    <line x1="20" y1="35" x2={20 + 100 * aspectRatio} y2="35" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="20" y1="65" x2={20 + 100 * aspectRatio} y2="65" stroke="#94a3b8" strokeWidth="1" />
                </>
            )}

            {type === GeometryType.AIRFOIL && (
                 <g transform="translate(60, 50) scale(0.6)">
                    <AirfoilSVGPath airfoil={airfoil} />
                </g>
            )}

        </svg>
    );
};

const ResultsDisplay: React.FC<{ result: AnalysisResult, params: SimulationParams }> = ({ result, params }) => {
    const { visualizationHint } = result;
    const { type } = params.geometry;
    const viewBoxWidth = type === GeometryType.AIRFOIL ? 150 : 200;

    return (
        <svg viewBox={`0 0 ${viewBoxWidth} 100`} className="w-full h-full">
            <defs>
                <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="25%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#eab308" />
                    <stop offset="75%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
                 <marker id="vecArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fillOpacity="0.7" fill="#e2e8f0" />
                </marker>
            </defs>

            {/* Pressure Contour (simplified) */}
            {visualizationHint.pressurePoints.map((p, i) => (
                <circle
                    key={`p-${i}`}
                    cx={p.x * viewBoxWidth}
                    cy={p.y * 100}
                    r={20}
                    fill={`url(#pressureGradient)`}
                    fillOpacity={p.value * 0.1}
                    style={{ filter: "blur(10px)" }}
                />
            ))}
            
            {/* Base Geometry */}
            <g opacity="0.6">
                <GeometryDisplay params={params} />
            </g>

            {/* Velocity Vectors */}
            {visualizationHint.velocityVectors.map((v, i) => (
                <g key={`v-${i}`} transform={`translate(${v.x * viewBoxWidth}, ${v.y * 100})`}>
                    <line
                        x1={0}
                        y1={0}
                        x2={Math.cos(v.angle) * v.magnitude * 15}
                        y2={Math.sin(v.angle) * v.magnitude * 15}
                        stroke="#e2e8f0"
                        strokeWidth={1 + v.magnitude}
                        strokeOpacity="0.7"
                        markerEnd="url(#vecArrow)"
                    />
                </g>
            ))}
        </svg>
    );
};


export const Viewer: React.FC<ViewerProps> = ({ params, result }) => {
    return (
        <div className="flex-1 bg-slate-900 p-4 flex items-center justify-center relative border-b-2 border-slate-800">
            <div className="w-full h-full max-w-4xl max-h-[40rem] aspect-video bg-black/20 rounded-lg p-2 border border-slate-700 shadow-inner">
                {!result ? (
                    <GeometryDisplay params={params} />
                ) : (
                    <ResultsDisplay result={result} params={params} />
                )}
            </div>
             <div className="absolute top-2 left-4 text-xs bg-slate-800/50 px-2 py-1 rounded">
                Görselleştirme
             </div>
        </div>
    );
};
