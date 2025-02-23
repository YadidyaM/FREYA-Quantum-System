import { useState, useEffect } from 'react';
import { SensorData } from '../datasets/sensor/types';
import { sensorTelemetryData } from '../datasets/sensor';

interface AnomalyMetrics {
  timestamp: string;
  temperature: number;
  vibration: number;
  power: number;
  pressure: number;
  anomalyScore: number;
  anomalyType: string | null;
}

export const useRealTimeAnomalies = (updateInterval = 2000) => {
  const [metrics, setMetrics] = useState<AnomalyMetrics[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    if (!isMonitoring) return;

    const baseData = [...sensorTelemetryData];
    let currentIndex = 0;

    const generateNewReading = (): AnomalyMetrics => {
      const baseReading = baseData[currentIndex % baseData.length];
      currentIndex++;

      // Add random variations to simulate real-time data
      const variation = () => (Math.random() - 0.5) * 0.1;
      
      const temperature = baseReading.temperature * (1 + variation());
      const vibration = baseReading.vibration_level * (1 + variation());
      const power = baseReading.power_consumption * (1 + variation());
      const pressure = baseReading.pressure * (1 + variation());

      // Calculate anomaly score based on thresholds
      const anomalyScore = calculateAnomalyScore(temperature, vibration, power, pressure);
      const anomalyType = determineAnomalyType(temperature, vibration, power, pressure);

      return {
        timestamp: new Date().toISOString(),
        temperature,
        vibration,
        power,
        pressure,
        anomalyScore,
        anomalyType
      };
    };

    // Initialize with some data
    setMetrics(Array.from({ length: 20 }, generateNewReading));

    const intervalId = setInterval(() => {
      setMetrics(current => {
        const newReading = generateNewReading();
        return [...current.slice(1), newReading];
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
  };

  return { metrics, isMonitoring, toggleMonitoring };
};

// Utility functions
const calculateAnomalyScore = (
  temperature: number,
  vibration: number,
  power: number,
  pressure: number
): number => {
  const tempScore = Math.max(0, (temperature - 75) / 25);
  const vibScore = Math.max(0, (vibration - 2) / 2);
  const powerScore = Math.max(0, (power - 200) / 100);
  const pressureScore = Math.abs(pressure - 45) / 20;

  return Math.min(1, (tempScore + vibScore + powerScore + pressureScore) / 4);
};

const determineAnomalyType = (
  temperature: number,
  vibration: number,
  power: number,
  pressure: number
): string | null => {
  if (temperature > 90) return 'Temperature Critical';
  if (vibration > 3) return 'High Vibration';
  if (power > 250) return 'Power Surge';
  if (pressure < 30 || pressure > 60) return 'Pressure Anomaly';
  if (temperature > 80 || vibration > 2.5 || power > 220 || Math.abs(pressure - 45) > 10) {
    return 'Warning Level';
  }
  return null;
};