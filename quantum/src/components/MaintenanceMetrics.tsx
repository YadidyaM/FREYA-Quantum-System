import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, DollarSign, Zap } from 'lucide-react';

interface MaintenanceMetricsProps {
  totalCost: number;
  averageDowntime: number;
  emergencyRate: number;
  supplyChainDelays: number;
}

const MaintenanceMetrics: React.FC<MaintenanceMetricsProps> = ({
  totalCost: initialTotalCost,
  averageDowntime: initialDowntime,
  emergencyRate: initialEmergencyRate,
  supplyChainDelays: initialDelays
}) => {
  // State for dynamic metrics
  const [metrics, setMetrics] = useState({
    totalCost: initialTotalCost,
    averageDowntime: initialDowntime,
    emergencyRate: initialEmergencyRate,
    supplyChainDelays: initialDelays
  });

  // Update metrics with realistic patterns
  useEffect(() => {
    const intervals = {
      cost: setInterval(() => {
        // Update cost every minute (simulated maintenance costs)
        setMetrics(current => ({
          ...current,
          totalCost: Math.max(0, current.totalCost + (Math.random() > 0.7 ? 
            // Occasional larger changes (maintenance events)
            (Math.random() * 2000 - 1000) :
            // Regular small fluctuations
            (Math.random() * 200 - 100)
          ))
        }));
      }, 60000), // Every minute

      downtime: setInterval(() => {
        // Update downtime every 5 minutes
        setMetrics(current => ({
          ...current,
          averageDowntime: Math.max(0, Math.min(72, // Cap at 72 hours
            current.averageDowntime + (Math.random() > 0.8 ?
              // Occasional significant changes
              (Math.random() * 0.5 - 0.25) :
              // Small adjustments
              (Math.random() * 0.1 - 0.05)
            )
          ))
        }));
      }, 300000), // Every 5 minutes

      emergencyRate: setInterval(() => {
        // Update emergency rate every 2 minutes
        setMetrics(current => ({
          ...current,
          emergencyRate: Math.max(0, Math.min(100,
            current.emergencyRate + (Math.random() > 0.9 ?
              // Sudden emergency events
              (Math.random() * 2 - 0.5) :
              // Gradual changes
              (Math.random() * 0.5 - 0.25)
            )
          ))
        }));
      }, 120000), // Every 2 minutes

      delays: setInterval(() => {
        // Update supply chain delays every 10 minutes
        setMetrics(current => ({
          ...current,
          supplyChainDelays: Math.max(0,
            current.supplyChainDelays + (Math.random() > 0.95 ?
              // New delay incident
              1 :
              // Resolution of existing delay
              (Math.random() > 0.7 ? -1 : 0)
            )
          )
        }));
      }, 600000) // Every 10 minutes
    };

    // Cleanup intervals
    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  // Simulate faster updates for development/demo purposes
  useEffect(() => {
    const fastUpdateInterval = setInterval(() => {
      setMetrics(current => ({
        totalCost: Math.max(0, current.totalCost + (Math.random() > 0.7 ? 
          (Math.random() * 2000 - 1000) : (Math.random() * 200 - 100)
        )),
        averageDowntime: Math.max(0, Math.min(72,
          current.averageDowntime + (Math.random() > 0.8 ?
            (Math.random() * 0.5 - 0.25) : (Math.random() * 0.1 - 0.05)
          )
        )),
        emergencyRate: Math.max(0, Math.min(100,
          current.emergencyRate + (Math.random() > 0.9 ?
            (Math.random() * 2 - 0.5) : (Math.random() * 0.5 - 0.25)
          )
        )),
        supplyChainDelays: Math.max(0,
          current.supplyChainDelays + (Math.random() > 0.95 ? 1 :
            (Math.random() > 0.7 ? -1 : 0)
          )
        )
      }));
    }, 3000); // Fast updates for demo

    return () => clearInterval(fastUpdateInterval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-blue-600/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="relative flex items-center">
          <DollarSign className="h-8 w-8 text-white" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">Total Cost</h2>
            <motion.p 
              key={metrics.totalCost}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-blue-100"
            >
              ${metrics.totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg p-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-purple-600/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="relative flex items-center">
          <Clock className="h-8 w-8 text-white" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">Avg Downtime</h2>
            <motion.p 
              key={metrics.averageDowntime}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-purple-100"
            >
              {metrics.averageDowntime.toFixed(1)} hours
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg p-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-600/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="relative flex items-center">
          <AlertTriangle className="h-8 w-8 text-white" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">Emergency Rate</h2>
            <motion.p 
              key={metrics.emergencyRate}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-red-100"
            >
              {metrics.emergencyRate.toFixed(1)}%
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg p-6 shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-amber-600/20 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="relative flex items-center">
          <Zap className="h-8 w-8 text-white" />
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-white">Supply Delays</h2>
            <motion.p 
              key={metrics.supplyChainDelays}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-amber-100"
            >
              {metrics.supplyChainDelays} incidents
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenanceMetrics;