import natural from 'natural';
import { FailureRecord } from '../data/failureHistory';
import { MaintenanceLog } from '../data/maintenanceLogs';

interface AnalysisResult {
  summary: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
}

export class QuantumNLP {
  private readonly tokenizer: natural.WordTokenizer;
  private readonly classifier: natural.BayesClassifier;
  private readonly tfidf: natural.TfIdf;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
    this.tfidf = new natural.TfIdf();
  }

  initialize(failureHistory: FailureRecord[], maintenanceLogs: MaintenanceLog[]) {
    // Train classifier with failure types
    failureHistory.forEach(failure => {
      this.classifier.addDocument(
        this.preprocessText(failure.failure_type + ' ' + failure.root_cause),
        failure.severity_score > 0.7 ? 'high_risk' : 
        failure.severity_score > 0.3 ? 'medium_risk' : 'low_risk'
      );
    });

    // Add maintenance logs to TF-IDF
    maintenanceLogs.forEach(log => {
      this.tfidf.addDocument(
        this.preprocessText(`${log.maintenance_type} maintenance with ${log.downtime_hours} hours downtime`)
      );
    });

    this.classifier.train();
  }

  async analyzeMaintenanceEvent(
    failureType: string,
    description: string,
    metrics: Record<string, number>
  ): Promise<AnalysisResult> {
    const combinedText = this.preprocessText(`${failureType} ${description}`);
    const tokens = this.tokenizer.tokenize(combinedText);
    
    // Classify risk level
    const classification = this.classifier.getClassifications(combinedText);
    const topClass = classification[0];
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      tokens,
      metrics,
      topClass.label as string
    );

    // Calculate confidence
    const confidence = this.calculateConfidence(classification, metrics);

    return {
      summary: this.generateSummary(tokens, metrics),
      recommendations,
      riskLevel: this.mapRiskLevel(topClass.label as string),
      confidence
    };
  }

  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private generateSummary(tokens: string[], metrics: Record<string, number>): string {
    const keyMetrics = Object.entries(metrics)
      .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
      .join(', ');

    const relevantTokens = tokens.filter(token => 
      !['the', 'a', 'an', 'and', 'or', 'but'].includes(token)
    );

    return `Analysis based on ${relevantTokens.length} key indicators and metrics (${keyMetrics}). ` +
           `Key factors identified: ${relevantTokens.slice(0, 3).join(', ')}.`;
  }

  private generateRecommendations(
    tokens: string[],
    metrics: Record<string, number>,
    riskClass: string
  ): string[] {
    const recommendations: string[] = [];

    // Analyze metrics
    if (metrics.temperature && metrics.temperature > 80) {
      recommendations.push('Implement enhanced cooling measures');
    }
    if (metrics.vibration_level && metrics.vibration_level > 2) {
      recommendations.push('Conduct vibration analysis and balance check');
    }
    if (metrics.power_consumption && metrics.power_consumption > 200) {
      recommendations.push('Optimize power consumption patterns');
    }

    // Add risk-based recommendations
    if (riskClass === 'high_risk') {
      recommendations.push('Immediate maintenance intervention required');
      recommendations.push('Schedule comprehensive system diagnostic');
    } else if (riskClass === 'medium_risk') {
      recommendations.push('Plan preventive maintenance within next cycle');
      recommendations.push('Monitor system parameters closely');
    }

    return recommendations;
  }

  private calculateConfidence(
    classifications: natural.Classification[],
    metrics: Record<string, number>
  ): number {
    const classificationConfidence = classifications[0].value;
    const metricsConfidence = Object.values(metrics).every(v => !isNaN(v)) ? 1 : 0.5;
    
    return (classificationConfidence + metricsConfidence) / 2;
  }

  private mapRiskLevel(classLabel: string): 'low' | 'medium' | 'high' {
    switch (classLabel) {
      case 'high_risk': return 'high';
      case 'medium_risk': return 'medium';
      case 'low_risk': return 'low';
      default: return 'medium';
    }
  }
}