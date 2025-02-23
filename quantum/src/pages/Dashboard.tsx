import React from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import SystemChatbot from '../components/SystemChatbot';
import MaintenanceMetrics from '../components/MaintenanceMetrics';
import RiskAnalysisChart from '../components/RiskAnalysisChart';
import { useMaintenanceAnalytics } from '../hooks/useMaintenanceAnalytics';
import { maintenanceLogs } from '../data/maintenanceLogs';
import { failureHistory } from '../data/failureHistory';
import { quantumPredictions } from '../data/quantumPredictions';
import { maintenanceSchedules } from '../data/maintenanceSchedule';

const Dashboard = () => {
  const analytics = useMaintenanceAnalytics(
    maintenanceLogs,
    failureHistory,
    quantumPredictions,
    maintenanceSchedules
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
        Freya
      </h1>
      
      <MaintenanceMetrics
        totalCost={analytics.totalCost}
        averageDowntime={analytics.averageDowntime}
        emergencyRate={analytics.emergencyRate}
        supplyChainDelays={analytics.supplyChainDelays}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">Risk Analysis</h2>
          <RiskAnalysisChart riskProfile={analytics.riskProfile} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">System Assistant</h2>
          <SystemChatbot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow-lg lg:col-span-2"
        >
          <h2 className="text-2xl font-semibold mb-4">High Risk Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.highRiskEquipment.map((equipmentId) => (
              <motion.div
                key={equipmentId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-red-400">Equipment #{equipmentId}</h3>
                  <p className="text-sm text-red-300/80">Critical Risk Level</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;