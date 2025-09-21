
import React, { useState, useCallback } from 'react';
import type { SimulationParams, AnalysisResult } from './types';
import { GeometryType, FluidType } from './types';
import { Sidebar } from './components/Sidebar';
import { Viewer } from './components/Viewer';
import { ResultsPanel } from './components/ResultsPanel';
import { Header } from './components/Header';
import { performAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    geometry: {
      type: GeometryType.PIPE,
      length: 10,
      diameter: 1,
      width: 1,
      height: 1,
      airfoil: 'NACA 2412'
    },
    fluid: FluidType.WATER,
    boundaryConditions: {
      inletVelocity: 5,
      outletPressure: 101325,
      temperature: 20
    }
  });

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunSimulation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysisResult = await performAnalysis(params);
      setResult(analysisResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  return (
    <div className="flex flex-col h-screen font-sans bg-slate-900 text-gray-300">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar 
          params={params}
          setParams={setParams}
          onRunSimulation={handleRunSimulation}
          isLoading={isLoading}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Viewer params={params} result={result} />
          <ResultsPanel result={result} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
};

export default App;
