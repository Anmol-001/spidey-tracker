import { apiClient } from '../../../services/api.client';
import { ApiResponse } from '../../../types/api.types';
import { HealthStatusData } from '../../../types/health.types';

/**
 * Fetches health check operational telemetry from the backend.
 */
export async function getHealthStatus(): Promise<ApiResponse<HealthStatusData>> {
  const response = await apiClient.get<ApiResponse<HealthStatusData>>('/health');
  return response.data;
}
