import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Brain, Cpu, Gauge, RefreshCw, PlayCircle, Loader2, Play, Pause } from 'lucide-react';
import { useRealTimeAnomalies } from '../hooks/useRealTimeAnomalies';
import RealTimeAnomalyChart from '../components/RealTimeAnomalyChart';
import { useAnomalyAnalysis } from '../hooks/useAnomalyAnalysis';
import { sensorTelemetryData } from '../datasets/sensor';

const AnomalyDetection = () => {
  const { metrics, isMonitoring, toggleMonitoring } = useRealTimeAnomalies();
  const { analysis, loading, error, analyzeData } = useAnomalyAnalysis(sensorTelemetryData);

  // Get latest metrics for display
  const latestMetrics = metrics[metrics.length - 1] || {
    temperature: 0,
    vibration: 0,
    power: 0,
    pressure: 0,
    anomalyScore: 0
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Quantum Anomaly Detection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Temperature</h2>
              <p className="text-red-100">
                {latestMetrics.temperature.toFixed(1)}°C
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Cpu className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Vibration</h2>
              <p className="text-emerald-100">
                {latestMetrics.vibration.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Gauge className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Power</h2>
              <p className="text-blue-100">
                {latestMetrics.power.toFixed(1)}W
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Anomaly Score</h2>
              <p className="text-amber-100">
                {(latestMetrics.anomalyScore * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Real-time Anomaly Detection</h2>
            <button
              onClick={toggleMonitoring}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isMonitoring ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Monitoring</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume Monitoring</span>
                </>
              )}
            </button>
          </div>
          <div className="h-96">
            <RealTimeAnomalyChart data={metrics} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Anomaly Analysis</h2>
            <button
              onClick={analyzeData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 text-red-400 rounded-lg">
              <div className="flex items-center justify-between">
                <p>{error}</p>
                <button
                  onClick={analyzeData}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/30 hover:bg-red-500/40 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {analysis && (
            <div className="mb-4 p-4 bg-blue-500/20 text-blue-400 rounded-lg">
              <h3 className="font-semibold mb-2">AI Analysis</h3>
              <p>{analysis}</p>
            </div>
          )}
          
          <div className="space-y-4">
            {metrics
              .filter(m => m.anomalyType)
              .slice(-5)
              .reverse()
              .map((anomaly, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className={`h-5 w-5 ${
                      anomaly.anomalyType?.includes('Critical') ? 'text-red-500' :
                      anomaly.anomalyType?.includes('High') ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="ml-3">
                      <h3 className="font-semibold">{anomaly.anomalyType}</h3>
                      <p className="text-gray-400">
                        {new Date(anomaly.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    anomaly.anomalyType?.includes('Critical') ? 'bg-red-500/20 text-red-400' :
                    anomaly.anomalyType?.includes('High') ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    Score: {(anomaly.anomalyScore * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnomalyDetection;