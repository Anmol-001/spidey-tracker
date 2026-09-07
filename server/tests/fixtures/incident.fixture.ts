import type { CreateIncidentInput } from '../../src/modules/incident/incident.types.js';

let counter = 1;

/**
 * Generates fresh incident creation payload for POST /incidents.
 */
export function buildIncidentPayload(
  overrides: Partial<CreateIncidentInput> = {},
): CreateIncidentInput {
  const id = counter++;
  return {
    title: `Suspicious activity reported #${id}`,
    description: `Armed robbery attempt witnessed at local store branch #${id}.`,
    category: 'crime',
    latitude: 40.7128,
    longitude: -74.006,
    address: `${id} Wall St, New York, NY`,
    ...overrides,
  };
}
