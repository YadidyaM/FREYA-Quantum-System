import { useMemo } from 'react';
import { MaintenanceLog } from '../data/maintenanceLogs';
import { FailureRecord } from '../data/failureHistory';
import { QuantumPrediction } from '../data/quantumPredictions';
import { MaintenanceSchedule } from '../data/maintenanceSchedule';

interface MaintenanceAnalytics {
  totalCost: number;
  averageDowntime: number;
  emergencyRate: number;
  supplyChainDelays: number;
  mostCommonFailureType: string;
  highRiskEquipment: number[];
  costSavings: number;
  schedulingEfficiency: number;
  riskProfile: {
    high: number;
    medium: number;
    low: number;
  };
}

export const useMaintenanceAnalytics = (
  maintenanceLogs: MaintenanceLog[],
  failureHistory: FailureRecord[],
  predictions: QuantumPrediction[],
  schedules: MaintenanceSchedule[]
): MaintenanceAnalytics => {
  return useMemo(() => {
    // Calculate total maintenance cost
    const totalCost = maintenanceLogs.reduce((sum, log) => sum + log.cost_usd, 0);

    // Calculate average downtime
    const averageDowntime = maintenanceLogs.reduce((sum, log) => 
      sum + log.downtime_hours, 0) / maintenanceLogs.length;

    // Calculate emergency maintenance rate
    const emergencyCount = maintenanceLogs.filter(
      log => log.maintenance_type === 'Emergency'
    ).length;
    const emergencyRate = (emergencyCount / maintenanceLogs.length) * 100;

    // Count supply chain delays
    const supplyChainDelays = maintenanceLogs.filter(
      log => log.delayed_due_to_supply_chain
    ).length;

    // Find most common failure type
    const failureTypes = failureHistory.reduce((acc, curr) => {
      acc[curr.failure_type] = (acc[curr.failure_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonFailureType = Object.entries(failureTypes)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Identify high-risk equipment
    const highRiskEquipment = predictions
      .filter(pred => pred.quantum_failure_risk > 0.7)
      .map(pred => pred.equipment_id);

    // Calculate potential cost savings
    const costSavings = schedules.reduce(
      (sum, schedule) => sum + schedule.maintenance_cost_savings, 0
    );

    // Calculate scheduling efficiency
    const schedulingEfficiency = schedules.reduce(
      (sum, schedule) => sum + (
        schedule.scheduling_conflict_detected ? 0 : 1
      ), 0
    ) / schedules.length * 100;

    // Calculate risk profile
    const riskProfile = predictions.reduce(
      (acc, pred) => {
        if (pred.quantum_failure_risk > 0.7) acc.high++;
        else if (pred.quantum_failure_risk > 0.3) acc.medium++;
        else acc.low++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    return {
      totalCost,
      averageDowntime,
      emergencyRate,
      supplyChainDelays,
      mostCommonFailureType,
      highRiskEquipment,
      costSavings,
      schedulingEfficiency,
      riskProfile
    };
  }, [maintenanceLogs, failureHistory, predictions, schedules]);
};