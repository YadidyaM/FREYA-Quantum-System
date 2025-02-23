import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Maximize2, 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Info,
  X,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Settings
} from 'lucide-react';
import QuantumBlueprintViewer from './QuantumBlueprintViewer';

export interface QubitConfig {
  id: string;
  type: 'superconducting' | 'ion-trap' | 'photonic';
  coherenceTime: number;
  gateTime: number;
  errorRate: number;
  layer: 'quantum' | 'control' | 'interface';
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  qubits: QubitConfig[];
  architecture: 'linear' | 'grid' | 'modular';
  errorCorrection: 'surface-code' | 'stabilizer-code' | 'none';
  controlSystem: 'microwave' | 'optical' | 'electrical';
}

interface Layer {
  id: 'quantum' | 'control' | 'interface';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const LAYERS: Layer[] = [
  {
    id: 'quantum',
    name: 'Quantum Layer',
    description: 'Core quantum processing units and quantum memory',
    icon: <Cpu className="w-5 h-5" />,
    color: 'blue'
  },
  {
    id: 'control',
    name: 'Control Layer',
    description: 'Quantum gate operations and error correction',
    icon: <Layers className="w-5 h-5" />,
    color: 'purple'
  },
  {
    id: 'interface',
    name: 'Interface Layer',
    description: 'Classical-quantum interface and I/O operations',
    icon: <Zap className="w-5 h-5" />,
    color: 'emerald'
  }
];

const QuantumBlueprint = () => {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([
    {
      id: '1',
      name: 'Basic Quantum Processor',
      description: 'Entry-level quantum computer with basic error correction',
      qubits: [
        {
          id: 'q1',
          type: 'superconducting',
          coherenceTime: 100,
          gateTime: 20,
          errorRate: 0.001,
          layer: 'quantum'
        }
      ],
      architecture: 'linear',
      errorCorrection: 'surface-code',
      controlSystem: 'microwave'
    }
  ]);

  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);
  const [isAddingQubit, setIsAddingQubit] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<Layer['id']>('quantum');
  const [editingBlueprint, setEditingBlueprint] = useState<string | null>(null);
  const [editedArchitecture, setEditedArchitecture] = useState<Blueprint['architecture']>('linear');

  const [newBlueprint, setNewBlueprint] = useState<Partial<Blueprint>>({
    name: '',
    description: '',
    architecture: 'linear',
    errorCorrection: 'surface-code',
    controlSystem: 'microwave'
  });

  const [newQubit, setNewQubit] = useState<Partial<QubitConfig>>({
    type: 'superconducting',
    coherenceTime: 100,
    gateTime: 20,
    errorRate: 0.001,
    layer: 'quantum'
  });

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (validateBlueprint(imported)) {
          setBlueprints(current => [...current, imported]);
          setImportError(null);
          setIsImporting(false);
        } else {
          setImportError('Invalid blueprint format');
        }
      } catch (err) {
        setImportError('Failed to parse blueprint file');
      }
    };
    reader.readAsText(file);
  };

  const validateBlueprint = (blueprint: any): blueprint is Blueprint => {
    return (
      blueprint &&
      typeof blueprint.name === 'string' &&
      typeof blueprint.description === 'string' &&
      Array.isArray(blueprint.qubits) &&
      ['linear', 'grid', 'modular'].includes(blueprint.architecture) &&
      ['surface-code', 'stabilizer-code', 'none'].includes(blueprint.errorCorrection) &&
      ['microwave', 'optical', 'electrical'].includes(blueprint.controlSystem)
    );
  };

  const handleCreateNew = () => {
    if (!newBlueprint.name || !newBlueprint.description) return;

    const blueprint: Blueprint = {
      id: Date.now().toString(),
      name: newBlueprint.name,
      description: newBlueprint.description,
      architecture: newBlueprint.architecture as 'linear',
      errorCorrection: newBlueprint.errorCorrection as 'surface-code',
      controlSystem: newBlueprint.controlSystem as 'microwave',
      qubits: []
    };

    setBlueprints(current => [...current, blueprint]);
    setNewBlueprint({
      name: '',
      description: '',
      architecture: 'linear',
      errorCorrection: 'surface-code',
      controlSystem: 'microwave'
    });
    setIsCreatingNew(false);
  };

  const handleArchitectureChange = (blueprintId: string, newArchitecture: Blueprint['architecture']) => {
    setBlueprints(current =>
      current.map(bp => {
        if (bp.id === blueprintId) {
          return {
            ...bp,
            architecture: newArchitecture
          };
        }
        return bp;
      })
    );
    setEditingBlueprint(null);
  };

  const addQubit = (blueprintId: string) => {
    if (!newQubit.type || !newQubit.layer) return;

    setBlueprints(current =>
      current.map(bp => {
        if (bp.id === blueprintId) {
          return {
            ...bp,
            qubits: [
              ...bp.qubits,
              {
                id: `q${bp.qubits.length + 1}`,
                type: newQubit.type!,
                coherenceTime: newQubit.coherenceTime!,
                gateTime: newQubit.gateTime!,
                errorRate: newQubit.errorRate!,
                layer: newQubit.layer!
              }
            ]
          };
        }
        return bp;
      })
    );
    setIsAddingQubit(false);
  };

  const removeQubit = (blueprintId: string, qubitId: string) => {
    setBlueprints(current =>
      current.map(bp => {
        if (bp.id === blueprintId) {
          return {
            ...bp,
            qubits: bp.qubits.filter(q => q.id !== qubitId)
          };
        }
        return bp;
      })
    );
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold text-white">Quantum Blueprints</h2>
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1 hover:bg-gray-700 rounded-full text-gray-300"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <label className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Blueprint</span>
          </button>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {LAYERS.map(layer => (
          <motion.button
            key={layer.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedLayer(layer.id)}
            className={`p-4 rounded-lg flex items-start gap-3 ${
              selectedLayer === layer.id
                ? `bg-${layer.color}-500/20 border border-${layer.color}-500/50`
                : 'bg-gray-700 border border-transparent'
            }`}
          >
            <div className={`mt-1 text-${layer.color}-400`}>{layer.icon}</div>
            <div className="text-left">
              <h3 className="font-medium text-white">{layer.name}</h3>
              <p className="text-sm text-gray-300">{layer.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Type</label>
          <select
            value={newQubit.type}
            onChange={e => setNewQubit(prev => ({ ...prev, type: e.target.value as any }))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="superconducting">Superconducting</option>
            <option value="ion-trap">Ion Trap</option>
            <option value="photonic">Photonic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Coherence Time (μs)
          </label>
          <input
            type="number"
            value={newQubit.coherenceTime}
            onChange={e => setNewQubit(prev => ({ ...prev, coherenceTime: +e.target.value }))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Gate Time (ns)
          </label>
          <input
            type="number"
            value={newQubit.gateTime}
            onChange={e => setNewQubit(prev => ({ ...prev, gateTime: +e.target.value }))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Error Rate
          </label>
          <input
            type="number"
            step="0.001"
            value={newQubit.errorRate}
            onChange={e => setNewQubit(prev => ({ ...prev, errorRate: +e.target.value }))}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blueprints.map(blueprint => (
          <motion.div
            key={blueprint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 border border-gray-600 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{blueprint.name}</h3>
                <p className="text-sm text-gray-300">{blueprint.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const data = JSON.stringify(blueprint, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${blueprint.name.toLowerCase().replace(/\s+/g, '-')}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-1 hover:bg-gray-600 rounded text-gray-300"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Blueprint Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-white">Architecture</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBlueprint(blueprint.id);
                      setEditedArchitecture(blueprint.architecture);
                    }}
                    className="p-1 hover:bg-gray-700 rounded text-blue-400"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                {editingBlueprint === blueprint.id ? (
                  <div className="flex gap-2">
                    <select
                      value={editedArchitecture}
                      onChange={(e) => setEditedArchitecture(e.target.value as Blueprint['architecture'])}
                      className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                    >
                      <option value="linear">Linear</option>
                      <option value="grid">Grid</option>
                      <option value="modular">Modular</option>
                    </select>
                    <button
                      onClick={() => handleArchitectureChange(blueprint.id, editedArchitecture)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingBlueprint(null)}
                      className="px-2 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 capitalize">{blueprint.architecture}</p>
                )}
              </div>

              <div className="bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Error Correction</span>
                </div>
                <p className="text-sm text-gray-300 capitalize">{blueprint.errorCorrection}</p>
              </div>

              <div className="bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Control System</span>
                </div>
                <p className="text-sm text-gray-300 capitalize">{blueprint.controlSystem}</p>
              </div>

              <div className="bg-gray-800 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-white">Qubits</span>
                </div>
                <p className="text-sm text-gray-300">{blueprint.qubits.length}</p>
              </div>
            </div>

            {/* 3D Viewer */}
            <div className="mt-6">
              <h4 className="font-medium text-white mb-3">Quantum Visualization</h4>
              <QuantumBlueprintViewer blueprint={blueprint} />
            </div>

            {/* Qubits by Layer */}
            {LAYERS.map(layer => {
              const layerQubits = blueprint.qubits.filter(q => q.layer === layer.id);
              if (layerQubits.length === 0 && layer.id !== selectedLayer) return null;

              return (
                <div key={layer.id} className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white flex items-center gap-2">
                      {layer.icon}
                      <span>{layer.name}</span>
                      <span className="text-gray-400">({layerQubits.length})</span>
                    </h4>
                    {layer.id === selectedLayer && (
                      <button
                        onClick={() => setIsAddingQubit(true)}
                        className="text-sm px-2 py-1 bg-blue-500/20 text-blue-400 rounded flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Qubit
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {layerQubits.map(qubit => (
                      <div
                        key={qubit.id}
                        className="bg-gray-800 rounded p-3 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{qubit.id}</span>
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                              {qubit.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Coherence: {qubit.coherenceTime}μs | 
                            Gate Time: {qubit.gateTime}ns | 
                            Error Rate: {(qubit.errorRate * 100).toFixed(2)}%
                          </div>
                        </div>
                        <button
                          onClick={() => removeQubit(blueprint.id, qubit.id)}
                          className="p-1 hover:bg-gray-700 rounded text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Add Qubit Form */}
            {isAddingQubit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="mt-4 bg-gray-800 rounded p-4"
              >
                <h4 className="font-medium text-white mb-3">Add New Qubit</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Type</label>
                    <select
                      value={newQubit.type}
                      onChange={e => setNewQubit(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                    >
                      <option value="superconducting">Superconducting</option>
                      <option value="ion-trap">Ion Trap</option>
                      <option value="photonic">Photonic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Coherence Time (μs)</label>
                    <input
                      type="number"
                      value={newQubit.coherenceTime}
                      onChange={e => setNewQubit(prev => ({ ...prev, coherenceTime: +e.target.value }))}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Gate Time (ns)</label>
                    <input
                      type="number"
                      value={newQubit.gateTime}
                      onChange={e => setNewQubit(prev => ({ ...prev, gateTime: +e.target.value }))}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Error Rate</label>
                    <input
                      type="number"
                      step="0.001"
                      value={newQubit.errorRate}
                      onChange={e => setNewQubit(prev => ({ ...prev, errorRate: +e.target.value }))}
                      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingQubit(false)}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addQubit(blueprint.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm"
                  >
                    Add Qubit
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Quantum Blueprint Guide</h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1 hover:bg-gray-700 rounded-full text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Layers</h4>
                  <ul className="space-y-2">
                    {LAYERS.map(layer => (
                      <li key={layer.id} className="flex items-start gap-2">
                        <div className={`mt-1 text-${layer.color}-400`}>{layer.icon}</div>
                        <div>
                          <p className="font-medium text-white">{layer.name}</p>
                          <p className="text-sm text-gray-300">{layer.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Features</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Import/Export blueprints as JSON</li>
                    <li>• Create custom quantum computer designs</li>
                    <li>• Configure qubits with detailed parameters</li>
                    <li>• Organize components in logical layers</li>
                    <li>• Visualize quantum states and entanglement</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Error Toast */}
      <AnimatePresence>
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            {importError}
            <button
              onClick={() => setImportError(null)}
              className="ml-2 p-1 hover:bg-red-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuantumBlueprint;