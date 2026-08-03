/**
 * Standard API Response Envelope Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiErrorDetails;
}

/**
 * Detailed error structure contained in failed responses
 */
export interface ApiErrorDetails {
  code: string;
  details?: unknown;
}

/**
 * Health check telemetry data contract
 */
export interface HealthStatusData {
  status: 'ok' | 'degraded' | 'error';
  timestamp?: string;
  uptime?: number;
  environment?: string;
}
