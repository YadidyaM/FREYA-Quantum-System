import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Binary, Box, BrainCircuit as Circuit, Cpu, Loader2, Play, Pause, RefreshCw, XCircle, CheckCircle, Maximize2 } from 'lucide-react';

interface QuantumState {
  id: string;
  state: '0' | '1' | 'superposition';
  entangled: boolean;
  coherence: number;
  error: number;
}

interface QuantumCircuit {
  id: string;
  name: string;
  gates: string[];
  qubits: number;
  depth: number;
  error_rate: number;
}

const QuantumComputing = () => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'correction' | 'visualization' | 'designer'>('simulator');
  const [isSimulating, setIsSimulating] = useState(false);
  const [quantumStates, setQuantumStates] = useState<QuantumState[]>([]);
  const [errorRate, setErrorRate] = useState(0.01);
  const [circuits, setCircuits] = useState<QuantumCircuit[]>([
    {
      id: '1',
      name: 'Bell State',
      gates: ['H', 'CNOT'],
      qubits: 2,
      depth: 2,
      error_rate: 0.01
    },
    {
      id: '2',
      name: 'Quantum Fourier Transform',
      gates: ['H', 'CPHASE', 'SWAP'],
      qubits: 4,
      depth: 8,
      error_rate: 0.02
    }
  ]);

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setQuantumStates(current => 
        current.map(state => ({
          ...state,
          coherence: Math.max(0, state.coherence - (Math.random() * 0.1)),
          error: Math.min(1, state.error + (Math.random() * 0.05)),
          state: Math.random() > 0.8 ? 
            (Math.random() > 0.5 ? '0' : '1') : 
            'superposition'
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const initializeQuantumStates = () => {
    const states: QuantumState[] = Array.from({ length: 4 }, (_, i) => ({
      id: `q${i}`,
      state: 'superposition',
      entangled: i % 2 === 1,
      coherence: 1,
      error: 0
    }));
    setQuantumStates(states);
  };

  const toggleSimulation = () => {
    if (!isSimulating) {
      initializeQuantumStates();
    }
    setIsSimulating(!isSimulating);
  };

  const applyErrorCorrection = () => {
    setQuantumStates(current =>
      current.map(state => ({
        ...state,
        error: Math.max(0, state.error - 0.5),
        coherence: Math.min(1, state.coherence + 0.3)
      }))
    );
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
          Quantum Computing Lab
        </h2>
        <div className="flex gap-2">
          <button
            onClick={toggleSimulation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
          >
            {isSimulating ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Start Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'simulator', name: 'Quantum Simulator', icon: <Atom /> },
          { id: 'correction', name: 'Error Correction', icon: <RefreshCw /> },
          { id: 'visualization', name: 'State Visualization', icon: <Binary /> },
          { id: 'designer', name: 'Circuit Designer', icon: <Circuit /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Quantum States Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {quantumStates.map(state => (
          <motion.div
            key={state.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${
                  state.state === 'superposition' ? 'bg-purple-500/20' :
                  state.state === '1' ? 'bg-blue-500/20' :
                  'bg-gray-600/20'
                }`}>
                  <Binary className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Qubit {state.id}</h3>
                  <p className="text-sm text-gray-400">
                    State: {state.state === 'superposition' ? '|ψ⟩' : state.state}
                  </p>
                </div>
              </div>
              {state.entangled && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                  Entangled
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Coherence</span>
                  <span>{(state.coherence * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${state.coherence * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Error Rate</span>
                  <span>{(state.error * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${state.error * 100}%` }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Circuit Designer */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Quantum Circuits</h3>
        <div className="grid grid-cols-2 gap-4">
          {circuits.map(circuit => (
            <motion.div
              key={circuit.id}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{circuit.name}</h4>
                <span className="text-sm text-gray-400">
                  {circuit.qubits} qubits
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {circuit.gates.map((gate, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm"
                  >
                    {gate}
                  </span>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Depth: {circuit.depth}</span>
                <span>Error: {(circuit.error_rate * 100).toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantumComputing;