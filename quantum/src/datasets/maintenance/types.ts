export interface MaintenanceLog {
  maintenance_id: number;
  equipment_id: number;
  maintenance_type: 'Emergency' | 'Corrective' | 'Preventive' | 'Routine';
  cost_usd: number;
  downtime_hours: number;
  maintenance_date: number;
  delayed_due_to_supply_chain: boolean;
  unexpected_failure_found: boolean;
}