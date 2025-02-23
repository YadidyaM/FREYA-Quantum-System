import { useState, useEffect } from 'react';
import { QuantumFailurePredictor } from '../models/QuantumFailurePredictor';
import { MaintenanceScheduler } from '../models/MaintenanceScheduler';
import { QuantumNLP } from '../models/QuantumNLP';
import { sensorTelemetryData } from '../datasets/sensor';
import { maintenanceLogs } from '../data/maintenanceLogs';
import { failureHistory } from '../data/failureHistory';
import { quantumPredictions } from '../data/quantumPredictions';
import { maintenanceSchedules } from '../data/maintenanceSchedule';

export const useQuantumAI = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [predictor] = useState(() => new QuantumFailurePredictor());
  const [scheduler] = useState(() => new MaintenanceScheduler());
  const [nlp] = useState(() => new QuantumNLP());

  useEffect(() => {
    const initializeAI = async () => {
      try {
        setIsLoading(true);
        
        // Initialize models
        await predictor.initialize();
        await predictor.train(sensorTelemetryData, failureHistory);
        
        nlp.initialize(failureHistory, maintenanceLogs);
        
        const optimizedSchedule = scheduler.optimizeSchedule(
          maintenanceSchedules,
          quantumPredictions,
          maintenanceLogs
        );

        setIsInitialized(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize AI models');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  const predictFailure = async (sensorData: typeof sensorTelemetryData[0]) => {
    if (!isInitialized) throw new Error('AI models not initialized');
    return predictor.predict(sensorData);
  };

  const optimizeSchedule = (
    currentSchedule = maintenanceSchedules,
    predictions = quantumPredictions,
    logs = maintenanceLogs
  ) => {
    if (!isInitialized) throw new Error('AI models not initialized');
    return scheduler.optimizeSchedule(currentSchedule, predictions, logs);
  };

  const analyzeEvent = async (
    failureType: string,
    description: string,
    metrics: Record<string, number>
  ) => {
    if (!isInitialized) throw new Error('AI models not initialized');
    return nlp.analyzeMaintenanceEvent(failureType, description, metrics);
  };

  return {
    isInitialized,
    isLoading,
    error,
    predictFailure,
    optimizeSchedule,
    analyzeEvent
  };
};