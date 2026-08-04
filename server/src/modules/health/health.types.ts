/**
 * Health check telemetry data contract
 */
export interface HealthStatusData {
  status: 'ok' | 'degraded' | 'error';
  timestamp?: string;
  uptime?: number;
  environment?: string;
}
