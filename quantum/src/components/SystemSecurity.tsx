import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Database, 
  Network,
  Search,
  FileSearch,
  HardDrive,
  Cpu,
  Loader2,
  XCircle,
  Zap,
  Atom
} from 'lucide-react';

interface SecurityMetric {
  name: string;
  status: 'secure' | 'warning' | 'breach';
  details: string;
  icon: React.ReactNode;
}

interface ScanResult {
  type: 'info' | 'warning' | 'error';
  message: string;
  location: string;
  timestamp: Date;
}

interface ScanStage {
  name: string;
  progress: number;
  status: 'pending' | 'scanning' | 'complete';
  icon: React.ReactNode;
  duration: number; // Duration in seconds
  quantumComplexity: number; // 1-10 scale
}

const SystemSecurity = () => {
  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    {
      name: 'Data Encryption',
      status: 'secure',
      details: 'AES-256 active',
      icon: <Lock className="w-5 h-5" />
    },
    {
      name: 'Database Security',
      status: 'warning',
      details: 'Updates pending',
      icon: <Database className="w-5 h-5" />
    },
    {
      name: 'Network Security',
      status: 'secure',
      details: 'Firewall active',
      icon: <Network className="w-5 h-5" />
    }
  ]);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [totalScanned, setTotalScanned] = useState(0);
  const [threatsFound, setThreatsFound] = useState(0);
  const [quantumEntanglementLevel, setQuantumEntanglementLevel] = useState(0);

  const scanStages: ScanStage[] = [
    { 
      name: 'Quantum State Initialization', 
      progress: 0, 
      status: 'pending', 
      icon: <Atom className="w-4 h-4" />,
      duration: 15,
      quantumComplexity: 8
    },
    { 
      name: 'Quantum Memory Analysis', 
      progress: 0, 
      status: 'pending', 
      icon: <Cpu className="w-4 h-4" />,
      duration: 25,
      quantumComplexity: 9
    },
    { 
      name: 'Entanglement Verification', 
      progress: 0, 
      status: 'pending', 
      icon: <Network className="w-4 h-4" />,
      duration: 20,
      quantumComplexity: 7
    },
    { 
      name: 'Decoherence Analysis', 
      progress: 0, 
      status: 'pending', 
      icon: <Zap className="w-4 h-4" />,
      duration: 30,
      quantumComplexity: 10
    }
  ];

  const [stages, setStages] = useState<ScanStage[]>(scanStages);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setCurrentStage(0);
    setScanResults([]);
    setTotalScanned(0);
    setThreatsFound(0);
    setQuantumEntanglementLevel(0);
    setStages(scanStages.map(stage => ({ ...stage, progress: 0, status: 'pending' })));
  };

  useEffect(() => {
    if (!isScanning) return;

    const simulateQuantumScan = () => {
      setStages(current => {
        const newStages = [...current];
        const activeStage = newStages[currentStage];
        
        if (activeStage) {
          activeStage.status = 'scanning';

          // Calculate progress increment based on quantum complexity
          const baseIncrement = 0.2; // Base progress increment
          const quantumFactor = Math.sin(Date.now() / 1000) * 0.1; // Quantum fluctuation
          const complexityFactor = 1 - (activeStage.quantumComplexity / 10);
          const progressIncrement = (baseIncrement * complexityFactor) + quantumFactor;

          activeStage.progress = Math.min(100, activeStage.progress + progressIncrement);

          // Simulate quantum effects
          const entanglementChange = Math.sin(Date.now() / 500) * 0.1;
          setQuantumEntanglementLevel(prev => 
            Math.min(1, Math.max(0, prev + entanglementChange))
          );

          // Simulate finding quantum anomalies
          if (Math.random() < 0.05 * (activeStage.quantumComplexity / 10)) {
            const anomalyTypes = [
              'Quantum state decoherence detected',
              'Unauthorized quantum entanglement observed',
              'Quantum tunneling anomaly found',
              'Superposition state corruption',
              'Quantum encryption key compromise',
              'Non-local correlation breach',
              'Quantum gate fidelity error',
              'Phase estimation deviation'
            ];
            
            const severity = Math.random();
            const type = severity > 0.7 ? 'error' : 
                        severity > 0.4 ? 'warning' : 'info';
            
            setScanResults(prev => [...prev, {
              type,
              message: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
              location: `quantum-sector-${Math.floor(Math.random() * 1000)}`,
              timestamp: new Date()
            }]);
            
            if (type !== 'info') {
              setThreatsFound(prev => prev + 1);
            }
          }

          // Simulate quantum operations count
          const quantumOps = Math.floor(
            Math.random() * 100 * activeStage.quantumComplexity
          );
          setTotalScanned(prev => prev + quantumOps);

          if (activeStage.progress >= 100) {
            activeStage.status = 'complete';
            if (currentStage < newStages.length - 1) {
              setCurrentStage(prev => prev + 1);
            } else {
              setIsScanning(false);
            }
          }
        }

        return newStages;
      });
    };

    // Slower interval for quantum operations
    const interval = setInterval(simulateQuantumScan, 500);
    return () => clearInterval(interval);
  }, [isScanning, currentStage]);

  const overallProgress = stages.reduce((sum, stage) => sum + stage.progress, 0) / stages.length;

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Quantum Security Analysis</h2>
        <button 
          onClick={startScan}
          disabled={isScanning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg flex items-center gap-2 transition-colors"
        >
          {isScanning ? (
            <>
              <Atom className="w-5 h-5 animate-spin-slow" />
              <span>Quantum Scan in Progress...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Initialize Quantum Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Scan Progress */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-medium text-lg">Quantum Security Scan</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-300">
                      Quantum Operations: {totalScanned.toLocaleString()}
                    </p>
                    <span className="text-gray-500">|</span>
                    <p className="text-sm text-gray-300">
                      Anomalies: {threatsFound}
                    </p>
                    <span className="text-gray-500">|</span>
                    <p className="text-sm text-gray-300">
                      Entanglement: {(quantumEntanglementLevel * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold text-blue-400">
                    {Math.round(overallProgress)}%
                  </p>
                  <p className="text-sm text-gray-400">Quantum Analysis Progress</p>
                </div>
              </div>

              {/* Stage Progress */}
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          stage.status === 'complete' ? 'bg-emerald-500/20' :
                          stage.status === 'scanning' ? 'bg-blue-500/20' :
                          'bg-gray-600/20'
                        }`}>
                          {stage.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          <p className="text-sm text-gray-400">
                            Quantum Complexity: {stage.quantumComplexity}/10
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {stage.progress.toFixed(1)}%
                        </span>
                        {stage.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : stage.status === 'scanning' ? (
                          <Atom className="w-5 h-5 text-blue-400 animate-spin-slow" />
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          stage.status === 'complete' ? 'bg-emerald-500' :
                          stage.status === 'scanning' ? 'bg-blue-500' :
                          'bg-gray-600'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Security Metrics</h3>
          <div className="space-y-4">
            {metrics.map(metric => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-gray-400">{metric.details}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    metric.status === 'secure' ? 'bg-emerald-500/20 text-emerald-400' :
                    metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {metric.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quantum Anomalies</h3>
          <div className="space-y-4">
            <AnimatePresence>
              {scanResults.slice().reverse().map((result, index) => (
                <motion.div
                  key={`${result.timestamp.getTime()}-${index}`}
                  initial={{ opacity: 0, x: 20, y: -20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    {result.type === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : result.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                    <div>
                      <p className="font-medium">{result.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-400">{result.location}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-400">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {scanResults.length === 0 && !isScanning && (
              <div className="text-center py-8 text-gray-400">
                <Atom className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No quantum anomalies detected</p>
                <p className="text-sm">Initialize quantum scan to begin analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSecurity;