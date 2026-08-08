/**
 * Incident Status Constants
 */
export const INCIDENT_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
} as const;

/**
 * Incident Severity Levels
 */
export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

/**
 * Incident Categories
 */
export const INCIDENT_CATEGORY = {
  CRIME: 'crime',
  FIRE: 'fire',
  ACCIDENT: 'accident',
  MEDICAL: 'medical',
  NATURAL_DISASTER: 'natural_disaster',
  OTHER: 'other',
} as const;
