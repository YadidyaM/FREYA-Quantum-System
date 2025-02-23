import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, LineChart, Sparkles, Play, Pause } from 'lucide-react';
import QuantumPerformanceChart from '../components/QuantumPerformanceChart';
import { useQuantumPerformance } from '../hooks/useQuantumPerformance';

const PredictiveAnalysis = () => {
  const { performanceData, isSimulating, toggleSimulation } = useQuantumPerformance();

  // Calculate current metrics for display
  const currentMetrics = performanceData[performanceData.length - 1] || {
    riskLevel: 0,
    costEfficiency: 0,
    maintenanceOptimization: 0,
    resourceUtilization: 0
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Quantum Predictive Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Risk Level</h2>
              <p className="text-red-100">
                {(currentMetrics.riskLevel * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Cost Efficiency</h2>
              <p className="text-emerald-100">
                {(currentMetrics.costEfficiency * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <LineChart className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Optimization</h2>
              <p className="text-indigo-100">
                {(currentMetrics.maintenanceOptimization * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Resource Usage</h2>
              <p className="text-amber-100">
                {(currentMetrics.resourceUtilization * 100).toFixed(1)}%
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
            <h2 className="text-2xl font-semibold">Maintenance Performance Trends</h2>
            <button
              onClick={toggleSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isSimulating ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Updates</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume Updates</span>
                </>
              )}
            </button>
          </div>
          <div className="h-96">
            <QuantumPerformanceChart data={performanceData} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictiveAnalysis;