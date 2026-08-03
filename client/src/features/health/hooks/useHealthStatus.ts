import { useQuery } from '@tanstack/react-query';
import { getHealthStatus } from '../services/health.api';

export const HEALTH_QUERY_KEY = ['health-status'] as const;

/**
 * Custom hook providing real-time backend operational health telemetry.
 */
export function useHealthStatus() {
  return useQuery({
    queryKey: HEALTH_QUERY_KEY,
    queryFn: getHealthStatus,
    refetchInterval: 10000,
    retry: 2,
    staleTime: 5000,
  });
}
