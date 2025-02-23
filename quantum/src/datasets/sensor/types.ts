export interface SensorData {
  timestamp: string;
  equipment_id: number;
  temperature: number;
  vibration_level: number;
  power_consumption: number;
  pressure: number;
  anomaly_type: string;
  is_anomaly: number;
}