import { useState, useEffect } from 'react';
import { AnomalyDetectionAgent } from '../agents/AnomalyDetectionAgent';
import { MaintenancePlannerAgent } from '../agents/MaintenancePlannerAgent';
import { PredictiveAnalysisAgent } from '../agents/PredictiveAnalysisAgent';
import { useQuantumAI } from './useQuantumAI';

export const useAIAgents = () => {
  const { 
    isInitialized,
    isLoading,
    error,
    predictor,
    scheduler,
    nlp
  } = useQuantumAI();

  const [agents, setAgents] = useState<{
    anomalyDetection: AnomalyDetectionAgent | null;
    maintenancePlanner: MaintenancePlannerAgent | null;
    predictiveAnalysis: PredictiveAnalysisAgent | null;
  }>({
    anomalyDetection: null,
    maintenancePlanner: null,
    predictiveAnalysis: null
  });

  useEffect(() => {
    if (isInitialized && predictor && scheduler && nlp) {
      setAgents({
        anomalyDetection: new AnomalyDetectionAgent(predictor),
        maintenancePlanner: new MaintenancePlannerAgent(
          scheduler,
          nlp,
          {
            technicians: 5,
            equipment: {
              'diagnostic_tools': 3,
              'repair_kits': 10,
              'safety_equipment': 8
            },
            parts: {
              'sensors': 15,
              'controllers': 5,
              'power_units': 7
            }
          }
        ),
        predictiveAnalysis: new PredictiveAnalysisAgent(predictor, nlp)
      });
    }
  }, [isInitialized, predictor, scheduler, nlp]);

  return {
    agents,
    isInitialized,
    isLoading,
    error
  };
};