import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, PenTool as Tool, Zap, Play, Pause } from 'lucide-react';
import MaintenanceCalendar from '../components/MaintenanceCalendar';
import { useMaintenancePlanner } from '../hooks/useMaintenancePlanner';

const MaintenancePlanner = () => {
  const { tasks, isPlanning, togglePlanning } = useMaintenancePlanner();

  // Calculate metrics
  const totalTasks = tasks.length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  const averageDuration = tasks.reduce((sum, t) => sum + t.estimatedDuration, 0) / totalTasks;
  const efficiency = tasks.reduce((sum, t) => sum + (1 - t.riskLevel), 0) / totalTasks;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Quantum Maintenance Planner</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Total Tasks</h2>
              <p className="text-red-100">{totalTasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Tool className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">High Priority</h2>
              <p className="text-yellow-100">{highPriorityTasks}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Avg Duration</h2>
              <p className="text-blue-100">{averageDuration.toFixed(1)}h</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-white" />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-white">Efficiency</h2>
              <p className="text-emerald-100">{(efficiency * 100).toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Maintenance Calendar</h2>
            <button
              onClick={togglePlanning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isPlanning ? (
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
          <MaintenanceCalendar tasks={tasks} />
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePlanner;