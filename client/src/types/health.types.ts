/**
 * System Health Telemetry Interface
 */
export interface HealthStatusData {
  status: 'ok' | 'degraded' | 'error';
  timestamp?: string;
  uptime?: number;
  environment?: string;
}
