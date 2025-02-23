import { QuantumFailurePredictor } from '../models/QuantumFailurePredictor';
import { QuantumNLP } from '../models/QuantumNLP';
import { SensorData } from '../datasets/sensor/types';
import { FailureRecord } from '../data/failureHistory';

interface RULPrediction {
  equipment_id: number;
  remaining_hours: number;
  confidence: number;
  failure_mode: string;
  contributing_factors: string[];
  recommended_actions: string[];
}

interface HealthScore {
  current: number;
  trend: 'improving' | 'stable' | 'degrading';
  factors: {
    name: string;
    impact: number;
    threshold: number;
  }[];
}

export class PredictiveAnalysisAgent {
  private predictor: QuantumFailurePredictor;
  private nlp: QuantumNLP;
  private readonly historyWindow = 720; // 30 days in hours
  private readonly predictionHorizon = 168; // 7 days in hours

  constructor(predictor: QuantumFailurePredictor, nlp: QuantumNLP) {
    this.predictor = predictor;
    this.nlp = nlp;
  }

  async predictRemainingLife(
    equipment_id: number,
    sensorHistory: SensorData[],
    failureHistory: FailureRecord[]
  ): Promise<RULPrediction> {
    // Filter relevant history
    const relevantSensorData = this.filterRelevantHistory(sensorHistory, equipment_id);
    const relevantFailures = failureHistory.filter(f => f.equipment_id === equipment_id);

    // Calculate health score
    const healthScore = await this.calculateHealthScore(relevantSensorData);

    // Predict failure probability over time
    const failureProbabilities = await this.predictFailureProbabilities(
      relevantSensorData[relevantSensorData.length - 1]
    );

    // Determine RUL
    const rul = this.calculateRUL(failureProbabilities, healthScore);

    // Generate recommendations
    const analysis = await this.analyzeFailureModes(
      relevantSensorData,
      relevantFailures,
      healthScore
    );

    return {
      equipment_id,
      remaining_hours: rul,
      confidence: this.calculateConfidence(healthScore, failureProbabilities),
      failure_mode: analysis.primaryFailureMode,
      contributing_factors: analysis.contributingFactors,
      recommended_actions: analysis.recommendations
    };
  }

  private filterRelevantHistory(
    history: SensorData[],
    equipment_id: number
  ): SensorData[] {
    const cutoffTime = Date.now() - (this.historyWindow * 60 * 60 * 1000);
    return history
      .filter(data => 
        data.equipment_id === equipment_id &&
        new Date(data.timestamp).getTime() >= cutoffTime
      )
      .sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  }

  private async calculateHealthScore(sensorData: SensorData[]): Promise<HealthScore> {
    if (sensorData.length === 0) {
      throw new Error('Insufficient sensor data for health score calculation');
    }

    const latest = sensorData[sensorData.length - 1];
    const factors = [
      {
        name: 'Temperature',
        value: latest.temperature,
        threshold: 80,
        weight: 0.3
      },
      {
        name: 'Vibration',
        value: latest.vibration_level,
        threshold: 3,
        weight: 0.3
      },
      {
        name: 'Power',
        value: latest.power_consumption,
        threshold: 200,
        weight: 0.2
      },
      {
        name: 'Pressure',
        value: latest.pressure,
        threshold: 50,
        weight: 0.2
      }
    ];

    // Calculate current health score
    const current = factors.reduce((score, factor) => {
      const normalizedValue = 1 - Math.min(factor.value / factor.threshold, 1);
      return score + (normalizedValue * factor.weight);
    }, 0);

    // Calculate trend
    const historicalScores = sensorData.map(data => {
      return factors.reduce((score, factor) => {
        const value = data[factor.name.toLowerCase() as keyof SensorData] as number;
        const normalizedValue = 1 - Math.min(value / factor.threshold, 1);
        return score + (normalizedValue * factor.weight);
      }, 0);
    });

    const trend = this.calculateTrend(historicalScores);

    return {
      current,
      trend,
      factors: factors.map(f => ({
        name: f.name,
        impact: 1 - (f.value / f.threshold),
        threshold: f.threshold
      }))
    };
  }

  private async predictFailureProbabilities(
    currentData: SensorData
  ): Promise<number[]> {
    const probabilities: number[] = [];
    let simulatedData = { ...currentData };

    for (let hour = 1; hour <= this.predictionHorizon; hour++) {
      const prediction = await this.predictor.predict(simulatedData);
      probabilities.push(prediction.quantum_failure_risk);

      // Update simulated data based on trends
      simulatedData = this.simulateNextTimeStep(simulatedData, hour);
    }

    return probabilities;
  }

  private simulateNextTimeStep(data: SensorData, hour: number): SensorData {
    // Simple linear extrapolation - in reality, would use more sophisticated methods
    return {
      ...data,
      temperature: data.temperature * (1 + 0.001 * hour),
      vibration_level: data.vibration_level * (1 + 0.002 * hour),
      power_consumption: data.power_consumption * (1 + 0.001 * hour),
      pressure: data.pressure * (1 + 0.001 * hour)
    };
  }

  private calculateRUL(
    probabilities: number[],
    healthScore: HealthScore
  ): number {
    // Find the first time step where probability exceeds threshold
    const failureThreshold = 0.7;
    const firstHighRisk = probabilities.findIndex(p => p >= failureThreshold);

    if (firstHighRisk === -1) {
      return this.predictionHorizon;
    }

    // Adjust RUL based on health score
    const baseRUL = firstHighRisk + 1;
    const healthFactor = healthScore.current;
    
    return Math.round(baseRUL * healthFactor);
  }

  private calculateTrend(scores: number[]): 'improving' | 'stable' | 'degrading' {
    if (scores.length < 2) return 'stable';

    const recentScores = scores.slice(-24); // Last 24 hours
    const averageChange = (recentScores[recentScores.length - 1] - recentScores[0]) / 
                         recentScores.length;

    if (averageChange > 0.01) return 'improving';
    if (averageChange < -0.01) return 'degrading';
    return 'stable';
  }

  private calculateConfidence(
    healthScore: HealthScore,
    probabilities: number[]
  ): number {
    const probabilityConsistency = 1 - Math.std(probabilities);
    const healthFactor = healthScore.current;
    const trendFactor = healthScore.trend === 'stable' ? 1 : 0.8;

    return (probabilityConsistency + healthFactor + trendFactor) / 3;
  }

  private async analyzeFailureModes(
    sensorData: SensorData[],
    failures: FailureRecord[],
    healthScore: HealthScore
  ): Promise<{
    primaryFailureMode: string;
    contributingFactors: string[];
    recommendations: string[];
  }> {
    const latest = sensorData[sensorData.length - 1];
    
    const analysis = await this.nlp.analyzeMaintenanceEvent(
      'Predictive Analysis',
      'Equipment health assessment',
      {
        temperature: latest.temperature,
        vibration: latest.vibration_level,
        power: latest.power_consumption,
        pressure: latest.pressure,
        health_score: healthScore.current
      }
    );

    const primaryFailureMode = this.determinePrimaryFailureMode(
      healthScore.factors,
      failures
    );

    return {
      primaryFailureMode,
      contributingFactors: this.identifyContributingFactors(healthScore),
      recommendations: analysis.recommendations
    };
  }

  private determinePrimaryFailureMode(
    healthFactors: HealthScore['factors'],
    failures: FailureRecord[]
  ): string {
    // Find the most critical health factor
    const criticalFactor = healthFactors
      .sort((a, b) => a.impact - b.impact)[0];

    // Match with historical failure modes
    const relatedFailures = failures
      .filter(f => f.failure_type.toLowerCase()
        .includes(criticalFactor.name.toLowerCase()));

    if (relatedFailures.length > 0) {
      return relatedFailures[0].failure_type;
    }

    return `${criticalFactor.name} Related Failure`;
  }

  private identifyContributingFactors(healthScore: HealthScore): string[] {
    return healthScore.factors
      .filter(f => f.impact < 0.7)
      .map(f => `${f.name} degradation (${(f.impact * 100).toFixed(1)}% of threshold)`);
  }
}