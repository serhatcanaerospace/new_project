
import React from 'react';
import type { SimulationParams } from '../types';
import { GeometryType, FluidType } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { AIRFOIL_TYPES } from '../constants';

interface SidebarProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  onRunSimulation: () => void;
  isLoading: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-cyan-400 border-b border-slate-600 pb-2 mb-3 uppercase tracking-wider">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
}

const NumberInput: React.FC<InputProps> = ({ label, unit, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <div className="flex items-center">
      <input 
        type="number"
        className="w-full bg-slate-700 border border-slate-600 rounded-l-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        {...props}
      />
      {unit && <span className="inline-flex items-center px-3 py-1.5 border border-l-0 border-slate-600 bg-slate-600 text-gray-400 text-sm rounded-r-md">{unit}</span>}
    </div>
  </div>
);


interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
        <select 
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            {...props}
        >
            {children}
        </select>
    </div>
);


export const Sidebar: React.FC<SidebarProps> = ({ params, setParams, onRunSimulation, isLoading }) => {
  const handleGeometryChange = <K extends keyof SimulationParams['geometry']>(key: K, value: SimulationParams['geometry'][K]) => {
    setParams(p => ({ ...p, geometry: { ...p.geometry, [key]: value } }));
  };

  const handleBCChange = <K extends keyof SimulationParams['boundaryConditions']>(key: K, value: SimulationParams['boundaryConditions'][K]) => {
    setParams(p => ({ ...p, boundaryConditions: { ...p.boundaryConditions, [key]: value } }));
  };

  return (
    <aside className="w-80 bg-slate-800 p-4 border-r border-slate-700 flex flex-col overflow-y-auto">
      <div className="flex-1">
        <Section title="Geometri">
          <Select 
            label="Geometri Tipi" 
            value={params.geometry.type} 
            onChange={e => handleGeometryChange('type', e.target.value as GeometryType)}
          >
            {Object.values(GeometryType).map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          
          {params.geometry.type === GeometryType.PIPE && (
            <>
              <NumberInput label="Uzunluk" unit="m" value={params.geometry.length} onChange={e => handleGeometryChange('length', +e.target.value)} />
              <NumberInput label="Çap" unit="m" value={params.geometry.diameter} onChange={e => handleGeometryChange('diameter', +e.target.value)} />
            </>
          )}

          {params.geometry.type === GeometryType.CHANNEL && (
             <>
              <NumberInput label="Uzunluk" unit="m" value={params.geometry.length} onChange={e => handleGeometryChange('length', +e.target.value)} />
              <NumberInput label="Genişlik" unit="m" value={params.geometry.width} onChange={e => handleGeometryChange('width', +e.target.value)} />
              <NumberInput label="Yükseklik" unit="m" value={params.geometry.height} onChange={e => handleGeometryChange('height', +e.target.value)} />
            </>
          )}
          
          {params.geometry.type === GeometryType.AIRFOIL && (
            <Select
              label="Profil Tipi"
              value={params.geometry.airfoil}
              onChange={e => handleGeometryChange('airfoil', e.target.value)}
            >
                {AIRFOIL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          )}
        </Section>

        <Section title="Akışkan">
          <Select 
            label="Akışkan Tipi"
            value={params.fluid}
            onChange={e => setParams(p => ({ ...p, fluid: e.target.value as FluidType }))}
          >
            {Object.values(FluidType).map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </Section>
        
        <Section title="Sınır Koşulları">
            <NumberInput label="Giriş Hızı" unit="m/s" value={params.boundaryConditions.inletVelocity} onChange={e => handleBCChange('inletVelocity', +e.target.value)} />
            <NumberInput label="Çıkış Basıncı" unit="Pa" value={params.boundaryConditions.outletPressure} onChange={e => handleBCChange('outletPressure', +e.target.value)} />
            <NumberInput label="Sıcaklık" unit="°C" value={params.boundaryConditions.temperature} onChange={e => handleBCChange('temperature', +e.target.value)} />
        </Section>

      </div>
      <div className="mt-4">
        <button
          onClick={onRunSimulation}
          disabled={isLoading}
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analiz Ediliyor...
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5 mr-2" />
              Analizi Başlat
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
