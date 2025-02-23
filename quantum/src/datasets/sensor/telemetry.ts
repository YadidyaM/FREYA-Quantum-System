import { SensorData } from './types';

export const sensorTelemetryData: SensorData[] = [
  {
    timestamp: "2023-01-01 00:00:00",
    equipment_id: 19755,
    temperature: 65.12,
    vibration_level: 1.73,
    power_consumption: 177.49,
    pressure: 51.96,
    anomaly_type: "No Anomaly",
    is_anomaly: 0
  },
  {
    timestamp: "2023-01-01 03:00:00",
    equipment_id: 13109,
    temperature: 72.7,
    vibration_level: 4.6706172878,
    power_consumption: 95.47,
    pressure: 50.77,
    anomaly_type: "Vibration Surge",
    is_anomaly: 1
  },
  {
    timestamp: "2023-01-01 12:00:00",
    equipment_id: 14223,
    temperature: 83.54,
    vibration_level: 1.77,
    power_consumption: 288.1967206272,
    pressure: 42.46,
    anomaly_type: "Power Surge",
    is_anomaly: 1
  },
  {
    timestamp: "2023-01-03 06:00:00",
    equipment_id: 13600,
    temperature: 102.2499195504,
    vibration_level: 2.24,
    power_consumption: 146.31,
    pressure: 47.58,
    anomaly_type: "Overheating",
    is_anomaly: 1
  },
  {
    timestamp: "2023-01-03 09:00:00",
    equipment_id: 19272,
    temperature: 71.12,
    vibration_level: 1.64,
    power_consumption: 116.65,
    pressure: 36.5,
    anomaly_type: "No Anomaly",
    is_anomaly: 0
  },
  {
    timestamp: "2023-01-03 12:00:00",
    equipment_id: 15824,
    temperature: 76.55,
    vibration_level: 2.16,
    power_consumption: 165.28,
    pressure: 26.0255258231,
    anomaly_type: "Pressure Drop",
    is_anomaly: 1
  }
];