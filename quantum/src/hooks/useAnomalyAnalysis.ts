import { useState, useCallback } from 'react';
import { chatService } from '../services/chat-service';
import { SensorData } from '../datasets/sensor/types';

export const useAnomalyAnalysis = (sensorData: SensorData[]) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeData = useCallback(async () => {
    if (sensorData.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      
      const anomalies = sensorData.filter(reading => reading.is_anomaly === 1);
      const anomalyData = {
        anomalies: anomalies.map(a => ({
          equipment_id: a.equipment_id,
          timestamp: a.timestamp,
          type: a.anomaly_type,
          metrics: {
            temperature: a.temperature,
            vibration: a.vibration_level,
            power: a.power_consumption,
            pressure: a.pressure
          }
        })),
        total_anomalies: anomalies.length,
        time_range: {
          start: anomalies[0]?.timestamp,
          end: anomalies[anomalies.length - 1]?.timestamp
        }
      };

      const result = await chatService.analyzeAnomalies(anomalyData);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [sensorData]);

  return { analysis, loading, error, analyzeData };
};