import { QuantumFailurePredictor } from '../models/QuantumFailurePredictor';
import { SensorData } from '../datasets/sensor/types';
import { QuantumPrediction } from '../data/quantumPredictions';

interface AnomalyAlert {
  equipment_id: number;
  alert_type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: number;
  metrics: Record<string, number>;
  confidence: number;
}

export class AnomalyDetectionAgent {
  private predictor: QuantumFailurePredictor;
  private readonly alertThresholds = {
    critical: 0.8,
    warning: 0.6
  };

  private readonly metricThresholds = {
    temperature: { warning: 75, critical: 90 },
    vibration_level: { warning: 3, critical: 4 },
    power_consumption: { warning: 200, critical: 250 },
    pressure: { warning: 45, critical: 55 }
  };

  constructor(predictor: QuantumFailurePredictor) {
    this.predictor = predictor;
  }

  async detectAnomalies(sensorData: SensorData[]): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];

    for (const data of sensorData) {
      const prediction = await this.predictor.predict(data);
      const anomalyAlerts = await this.analyzeReading(data, prediction);
      alerts.push(...anomalyAlerts);
    }

    return this.prioritizeAlerts(alerts);
  }

  private async analyzeReading(
    data: SensorData,
    prediction: QuantumPrediction
  ): Promise<AnomalyAlert[]> {
    const alerts: AnomalyAlert[] = [];
    const timestamp = Date.now();

    // Check quantum prediction risk
    if (prediction.quantum_failure_risk >= this.alertThresholds.critical) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'critical',
        message: `Critical failure risk detected (${(prediction.quantum_failure_risk * 100).toFixed(1)}% probability)`,
        timestamp,
        metrics: this.extractMetrics(data),
        confidence: prediction.confidence_score
      });
    } else if (prediction.quantum_failure_risk >= this.alertThresholds.warning) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'warning',
        message: `Elevated failure risk detected (${(prediction.quantum_failure_risk * 100).toFixed(1)}% probability)`,
        timestamp,
        metrics: this.extractMetrics(data),
        confidence: prediction.confidence_score
      });
    }

    // Check individual metrics
    const metricAlerts = this.checkMetricThresholds(data);
    alerts.push(...metricAlerts);

    return alerts;
  }

  private checkMetricThresholds(data: SensorData): AnomalyAlert[] {
    const alerts: AnomalyAlert[] = [];
    const metrics = this.extractMetrics(data);

    // Temperature check
    if (data.temperature >= this.metricThresholds.temperature.critical) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'critical',
        message: `Critical temperature level: ${data.temperature}°C`,
        timestamp: Date.now(),
        metrics,
        confidence: 1
      });
    } else if (data.temperature >= this.metricThresholds.temperature.warning) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'warning',
        message: `High temperature level: ${data.temperature}°C`,
        timestamp: Date.now(),
        metrics,
        confidence: 1
      });
    }

    // Vibration check
    if (data.vibration_level >= this.metricThresholds.vibration_level.critical) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'critical',
        message: `Critical vibration level: ${data.vibration_level}`,
        timestamp: Date.now(),
        metrics,
        confidence: 1
      });
    } else if (data.vibration_level >= this.metricThresholds.vibration_level.warning) {
      alerts.push({
        equipment_id: data.equipment_id,
        alert_type: 'warning',
        message: `High vibration level: ${data.vibration_level}`,
        timestamp: Date.now(),
        metrics,
        confidence: 1
      });
    }

    // Add similar checks for power_consumption and pressure
    return alerts;
  }

  private extractMetrics(data: SensorData): Record<string, number> {
    return {
      temperature: data.temperature,
      vibration_level: data.vibration_level,
      power_consumption: data.power_consumption,
      pressure: data.pressure
    };
  }

  private prioritizeAlerts(alerts: AnomalyAlert[]): AnomalyAlert[] {
    return alerts.sort((a, b) => {
      // Sort by alert type priority
      const typePriority = { critical: 3, warning: 2, info: 1 };
      const priorityDiff = typePriority[b.alert_type] - typePriority[a.alert_type];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by confidence
      return b.confidence - a.confidence;
    });
  }
}