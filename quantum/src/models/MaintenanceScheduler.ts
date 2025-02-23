import { Matrix } from 'ml-matrix';
import { MaintenanceSchedule } from '../data/maintenanceSchedule';
import { MaintenanceLog } from '../data/maintenanceLogs';
import { QuantumPrediction } from '../data/quantumPredictions';

interface SchedulingConstraints {
  maxConcurrentMaintenance: number;
  minTimeBetweenMaintenance: number;
  maxMaintenanceDelay: number;
}

export class MaintenanceScheduler {
  private readonly constraints: SchedulingConstraints;

  constructor(constraints: SchedulingConstraints = {
    maxConcurrentMaintenance: 3,
    minTimeBetweenMaintenance: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxMaintenanceDelay: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }) {
    this.constraints = constraints;
  }

  optimizeSchedule(
    currentSchedule: MaintenanceSchedule[],
    predictions: QuantumPrediction[],
    maintenanceLogs: MaintenanceLog[]
  ): MaintenanceSchedule[] {
    const optimizedSchedule = [...currentSchedule];
    const timeSlots = this.generateTimeSlots(currentSchedule);
    const equipmentRisks = this.calculateEquipmentRisks(predictions);
    const maintenanceHistory = this.analyzeMaintenanceHistory(maintenanceLogs);

    // Sort by risk and cost savings potential
    optimizedSchedule.sort((a, b) => {
      const riskA = equipmentRisks.get(a.equipment_id) || 0;
      const riskB = equipmentRisks.get(b.equipment_id) || 0;
      const costEfficiencyA = a.maintenance_cost_savings / (a.part_availability_delay_days || 1);
      const costEfficiencyB = b.maintenance_cost_savings / (b.part_availability_delay_days || 1);
      
      return (riskB + costEfficiencyB) - (riskA + costEfficiencyA);
    });

    // Optimize each maintenance slot
    for (const schedule of optimizedSchedule) {
      const optimalSlot = this.findOptimalTimeSlot(
        schedule,
        timeSlots,
        equipmentRisks.get(schedule.equipment_id) || 0,
        maintenanceHistory.get(schedule.equipment_id)
      );

      if (optimalSlot) {
        schedule.optimal_schedule_using_quantum = optimalSlot;
        schedule.maintenance_cost_savings = this.calculateCostSavings(
          schedule,
          optimalSlot,
          equipmentRisks.get(schedule.equipment_id) || 0
        );
      }
    }

    return optimizedSchedule;
  }

  private generateTimeSlots(currentSchedule: MaintenanceSchedule[]): Set<number> {
    const slots = new Set<number>();
    const startTime = Math.min(...currentSchedule.map(s => s.next_scheduled_maintenance));
    const endTime = Math.max(...currentSchedule.map(s => s.next_scheduled_maintenance));
    
    for (let time = startTime; time <= endTime; time += this.constraints.minTimeBetweenMaintenance) {
      slots.add(time);
    }
    
    return slots;
  }

  private calculateEquipmentRisks(predictions: QuantumPrediction[]): Map<number, number> {
    const risks = new Map<number, number>();
    
    for (const prediction of predictions) {
      risks.set(
        prediction.equipment_id,
        prediction.quantum_failure_risk * prediction.confidence_score
      );
    }
    
    return risks;
  }

  private analyzeMaintenanceHistory(logs: MaintenanceLog[]): Map<number, MaintenanceLog[]> {
    const history = new Map<number, MaintenanceLog[]>();
    
    for (const log of logs) {
      const equipmentLogs = history.get(log.equipment_id) || [];
      equipmentLogs.push(log);
      history.set(log.equipment_id, equipmentLogs);
    }
    
    return history;
  }

  private findOptimalTimeSlot(
    schedule: MaintenanceSchedule,
    availableSlots: Set<number>,
    risk: number,
    history?: MaintenanceLog[]
  ): number {
    let optimalSlot = schedule.next_scheduled_maintenance;
    let minCost = Infinity;

    for (const slot of availableSlots) {
      if (Math.abs(slot - schedule.next_scheduled_maintenance) > this.constraints.maxMaintenanceDelay) {
        continue;
      }

      const cost = this.calculateSchedulingCost(
        schedule,
        slot,
        risk,
        history
      );

      if (cost < minCost) {
        minCost = cost;
        optimalSlot = slot;
      }
    }

    return optimalSlot;
  }

  private calculateSchedulingCost(
    schedule: MaintenanceSchedule,
    proposedTime: number,
    risk: number,
    history?: MaintenanceLog[]
  ): number {
    const timeDeviation = Math.abs(proposedTime - schedule.next_scheduled_maintenance);
    const riskFactor = risk * timeDeviation;
    const partDelayCost = schedule.part_availability_delay_days * 1000;
    const historicalFactor = this.calculateHistoricalFactor(history);

    return riskFactor + partDelayCost + historicalFactor;
  }

  private calculateHistoricalFactor(history?: MaintenanceLog[]): number {
    if (!history || history.length === 0) return 0;

    const emergencyRate = history.filter(log => 
      log.maintenance_type === 'Emergency'
    ).length / history.length;

    const averageCost = history.reduce((sum, log) => 
      sum + log.cost_usd, 0
    ) / history.length;

    return emergencyRate * averageCost;
  }

  private calculateCostSavings(
    schedule: MaintenanceSchedule,
    optimalTime: number,
    risk: number
  ): number {
    const originalCost = this.calculateSchedulingCost(
      schedule,
      schedule.next_scheduled_maintenance,
      risk
    );
    const optimizedCost = this.calculateSchedulingCost(
      schedule,
      optimalTime,
      risk
    );

    return Math.max(0, originalCost - optimizedCost);
  }
}