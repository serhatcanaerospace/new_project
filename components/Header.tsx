
import React from 'react';
import { WaveIcon } from './icons/WaveIcon';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center p-3 border-b border-slate-700 bg-slate-800/50 shadow-md">
            <WaveIcon className="w-8 h-8 text-cyan-400 mr-3" />
            <h1 className="text-xl font-bold text-gray-200 tracking-wider">
                AI Akışkanlar Dinamiği Simülatörü
            </h1>
            <span className="ml-auto text-sm text-gray-500">Konsept Model v1.0</span>
        </header>
    );
};
