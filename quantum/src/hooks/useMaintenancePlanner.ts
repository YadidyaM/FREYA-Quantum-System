import { useState, useEffect } from 'react';
import { maintenanceSchedules } from '../data/maintenanceSchedule';
import { useRealTimeAnomalies } from './useRealTimeAnomalies';

interface MaintenanceTask {
  id: number;
  equipmentId: number;
  scheduledTime: number;
  priority: 'high' | 'medium' | 'low';
  type: 'Preventive' | 'Corrective' | 'Emergency';
  description: string;
  estimatedDuration: number;
  riskLevel: number;
}

export const useMaintenancePlanner = (updateInterval = 5000) => {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const { metrics } = useRealTimeAnomalies();
  const [isPlanning, setIsPlanning] = useState(true);

  useEffect(() => {
    if (!isPlanning) return;

    const generateMaintenanceTasks = () => {
      // Get current anomalies
      const currentAnomalies = metrics.filter(m => m.anomalyType);

      // Base tasks from maintenance schedules
      const baseTasks = maintenanceSchedules.map(schedule => ({
        id: Math.random(),
        equipmentId: schedule.equipment_id,
        scheduledTime: schedule.optimal_schedule_using_quantum,
        priority: getPriority(schedule.risk_of_failure_before_next_maintenance),
        type: 'Preventive' as const,
        description: `Scheduled maintenance for Equipment ${schedule.equipment_id}`,
        estimatedDuration: 4 + Math.random() * 4, // 4-8 hours
        riskLevel: schedule.risk_of_failure_before_next_maintenance
      }));

      // Generate additional tasks based on anomalies
      const anomalyTasks = currentAnomalies.map(anomaly => ({
        id: Math.random(),
        equipmentId: Math.floor(10000 + Math.random() * 10000),
        scheduledTime: Date.now() + 1000 * 60 * 60 * 24, // Schedule for tomorrow
        priority: getPriorityFromAnomaly(anomaly.anomalyScore),
        type: getMaintenanceType(anomaly.anomalyScore),
        description: `${anomaly.anomalyType} detected - Maintenance required`,
        estimatedDuration: 2 + Math.random() * 4, // 2-6 hours
        riskLevel: anomaly.anomalyScore
      }));

      return [...baseTasks, ...anomalyTasks].sort((a, b) => {
        // Sort by priority first, then by scheduled time
        const priorityScore = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityScore[b.priority] - priorityScore[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.scheduledTime - b.scheduledTime;
      });
    };

    // Initialize tasks
    setTasks(generateMaintenanceTasks());

    // Update tasks periodically
    const intervalId = setInterval(() => {
      setTasks(generateMaintenanceTasks());
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [isPlanning, metrics]);

  const togglePlanning = () => {
    setIsPlanning(prev => !prev);
  };

  return {
    tasks,
    isPlanning,
    togglePlanning
  };
};

// Utility functions
const getPriority = (risk: number): 'high' | 'medium' | 'low' => {
  if (risk >= 0.7) return 'high';
  if (risk >= 0.4) return 'medium';
  return 'low';
};

const getPriorityFromAnomaly = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
};

const getMaintenanceType = (score: number): 'Preventive' | 'Corrective' | 'Emergency' => {
  if (score >= 0.7) return 'Emergency';
  if (score >= 0.4) return 'Corrective';
  return 'Preventive';
};