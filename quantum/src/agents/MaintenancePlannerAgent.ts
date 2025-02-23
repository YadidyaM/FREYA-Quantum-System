import { MaintenanceScheduler } from '../models/MaintenanceScheduler';
import { QuantumNLP } from '../models/QuantumNLP';
import { MaintenanceSchedule } from '../data/maintenanceSchedule';
import { MaintenanceLog } from '../data/maintenanceLogs';
import { QuantumPrediction } from '../data/quantumPredictions';

interface MaintenancePlan {
  equipment_id: number;
  recommended_date: number;
  priority: 'high' | 'medium' | 'low';
  estimated_duration: number;
  required_resources: string[];
  cost_estimate: number;
  risk_mitigation: string[];
}

interface ResourceAvailability {
  technicians: number;
  equipment: Record<string, number>;
  parts: Record<string, number>;
}

export class MaintenancePlannerAgent {
  private scheduler: MaintenanceScheduler;
  private nlp: QuantumNLP;
  private resources: ResourceAvailability;

  constructor(
    scheduler: MaintenanceScheduler,
    nlp: QuantumNLP,
    resources: ResourceAvailability
  ) {
    this.scheduler = scheduler;
    this.nlp = nlp;
    this.resources = resources;
  }

  async generateMaintenancePlans(
    currentSchedule: MaintenanceSchedule[],
    predictions: QuantumPrediction[],
    maintenanceLogs: MaintenanceLog[]
  ): Promise<MaintenancePlan[]> {
    // Optimize schedule using quantum scheduler
    const optimizedSchedule = this.scheduler.optimizeSchedule(
      currentSchedule,
      predictions,
      maintenanceLogs
    );

    // Generate detailed maintenance plans
    const plans: MaintenancePlan[] = [];

    for (const schedule of optimizedSchedule) {
      const prediction = predictions.find(p => p.equipment_id === schedule.equipment_id);
      const history = maintenanceLogs.filter(log => log.equipment_id === schedule.equipment_id);
      
      if (prediction) {
        const plan = await this.createMaintenancePlan(schedule, prediction, history);
        plans.push(plan);
      }
    }

    return this.prioritizePlans(plans);
  }

  private async createMaintenancePlan(
    schedule: MaintenanceSchedule,
    prediction: QuantumPrediction,
    history: MaintenanceLog[]
  ): Promise<MaintenancePlan> {
    // Calculate priority based on multiple factors
    const priority = this.calculatePriority(schedule, prediction);

    // Estimate duration based on historical data
    const estimatedDuration = this.estimateMaintenanceDuration(history);

    // Determine required resources
    const requiredResources = this.determineRequiredResources(
      prediction.predicted_failure_type,
      history
    );

    // Calculate cost estimate
    const costEstimate = this.calculateCostEstimate(
      requiredResources,
      estimatedDuration
    );

    // Generate risk mitigation strategies
    const riskMitigation = await this.generateRiskMitigation(
      prediction,
      schedule
    );

    return {
      equipment_id: schedule.equipment_id,
      recommended_date: schedule.optimal_schedule_using_quantum,
      priority,
      estimated_duration: estimatedDuration,
      required_resources: requiredResources,
      cost_estimate: costEstimate,
      risk_mitigation
    };
  }

  private calculatePriority(
    schedule: MaintenanceSchedule,
    prediction: QuantumPrediction
  ): 'high' | 'medium' | 'low' {
    const riskScore = prediction.quantum_failure_risk * prediction.confidence_score;
    const urgencyScore = schedule.risk_of_failure_before_next_maintenance;
    const combinedScore = (riskScore + urgencyScore) / 2;

    if (combinedScore >= 0.7) return 'high';
    if (combinedScore >= 0.4) return 'medium';
    return 'low';
  }

  private estimateMaintenanceDuration(history: MaintenanceLog[]): number {
    if (history.length === 0) return 4; // Default duration in hours

    // Calculate weighted average of historical durations
    const recentLogs = history.slice(-5); // Consider last 5 maintenance events
    const totalWeight = recentLogs.reduce((sum, _, i) => sum + (i + 1), 0);
    
    const weightedDuration = recentLogs.reduce((sum, log, i) => 
      sum + (log.downtime_hours * (i + 1)), 0
    ) / totalWeight;

    return Math.round(weightedDuration);
  }

  private determineRequiredResources(
    failureType: string,
    history: MaintenanceLog[]
  ): string[] {
    const baseResources = ['Maintenance Technician', 'Basic Tool Kit'];
    
    switch (failureType) {
      case 'Power Surge':
        return [...baseResources, 'Power Analyzer', 'Electrical Safety Kit'];
      case 'Vibration Issue':
        return [...baseResources, 'Vibration Analyzer', 'Balancing Equipment'];
      default:
        return baseResources;
    }
  }

  private calculateCostEstimate(
    resources: string[],
    duration: number
  ): number {
    const hourlyRate = 150; // Base hourly rate for maintenance
    const resourceCosts = resources.reduce((total, resource) => {
      switch (resource) {
        case 'Power Analyzer': return total + 500;
        case 'Vibration Analyzer': return total + 750;
        case 'Electrical Safety Kit': return total + 300;
        case 'Balancing Equipment': return total + 1000;
        default: return total + 100; // Basic tool cost
      }
    }, 0);

    return (hourlyRate * duration) + resourceCosts;
  }

  private async generateRiskMitigation(
    prediction: QuantumPrediction,
    schedule: MaintenanceSchedule
  ): Promise<string[]> {
    const analysis = await this.nlp.analyzeMaintenanceEvent(
      prediction.predicted_failure_type,
      'Scheduled maintenance planning',
      {
        failure_risk: prediction.quantum_failure_risk,
        confidence: prediction.confidence_score,
        days_until_maintenance: Math.floor(
          (schedule.optimal_schedule_using_quantum - Date.now()) / (1000 * 60 * 60 * 24)
        )
      }
    );

    return analysis.recommendations;
  }

  private prioritizePlans(plans: MaintenancePlan[]): MaintenancePlan[] {
    return plans.sort((a, b) => {
      const priorityScore = { high: 3, medium: 2, low: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority];
    });
  }
}