import { HealthStatusData } from './health.types.js';

export interface IHealthService {
  checkHealth: () => Promise<HealthStatusData>;
}

export class HealthService implements IHealthService {
  public async checkHealth(): Promise<HealthStatusData> {
    return {
      status: 'ok',
    };
  }
}

export const healthService = new HealthService();
