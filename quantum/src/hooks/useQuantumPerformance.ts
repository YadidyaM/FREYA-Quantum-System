import { useState, useEffect } from 'react';
import { maintenanceSchedules } from '../data/maintenanceSchedule';
import { quantumPredictions } from '../data/quantumPredictions';

interface QuantumPerformanceData {
  timestamp: number;
  riskLevel: number;
  costEfficiency: number;
  maintenanceOptimization: number;
  resourceUtilization: number;
}

export const useQuantumPerformance = (updateInterval = 5000) => {
  const [performanceData, setPerformanceData] = useState<QuantumPerformanceData[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;

    const generateMetricsFromRealData = () => {
      // Sort schedules by timestamp
      const sortedSchedules = [...maintenanceSchedules].sort(
        (a, b) => a.optimal_schedule_using_quantum - b.optimal_schedule_using_quantum
      );

      // Calculate metrics based on real data
      const metrics = sortedSchedules.map(schedule => {
        const prediction = quantumPredictions.find(p => p.equipment_id === schedule.equipment_id);
        const riskLevel = schedule.risk_of_failure_before_next_maintenance;
        
        // Calculate cost efficiency (normalized)
        const costEfficiency = schedule.maintenance_cost_savings / 10000; // Normalize to 0-1 range

        // Calculate maintenance optimization score
        const timeOptimization = Math.abs(
          schedule.optimal_schedule_using_quantum - schedule.next_scheduled_maintenance
        ) / (24 * 60 * 60 * 1000); // Convert to days
        const maintenanceOptimization = 1 - Math.min(timeOptimization / 7, 1); // Normalize to 0-1

        // Calculate resource utilization
        const resourceUtilization = 1 - (schedule.part_availability_delay_days / 20); // Normalize to 0-1

        return {
          timestamp: schedule.optimal_schedule_using_quantum,
          riskLevel,
          costEfficiency,
          maintenanceOptimization,
          resourceUtilization
        };
      });

      setPerformanceData(metrics);
    };

    // Generate initial data
    generateMetricsFromRealData();

    // Update periodically with variations
    const intervalId = setInterval(() => {
      setPerformanceData(current => 
        current.map(metric => ({
          ...metric,
          riskLevel: metric.riskLevel * (0.95 + Math.random() * 0.1),
          costEfficiency: metric.costEfficiency * (0.98 + Math.random() * 0.04),
          maintenanceOptimization: metric.maintenanceOptimization * (0.97 + Math.random() * 0.06),
          resourceUtilization: metric.resourceUtilization * (0.96 + Math.random() * 0.08)
        }))
      );
    }, updateInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [isSimulating, updateInterval]);

  const toggleSimulation = () => {
    setIsSimulating(prev => !prev);
  };

  return {
    performanceData,
    isSimulating,
    toggleSimulation
  };
};