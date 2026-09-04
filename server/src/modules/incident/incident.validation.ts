import { z } from 'zod';
import { INCIDENT_CATEGORY, INCIDENT_SEVERITY, INCIDENT_STATUS } from './incident.constants.js';
import { IncidentCategory, IncidentSeverity, IncidentStatus } from './incident.types.js';

/**
 * MongoDB ObjectId Regex (24 hexadecimal characters)
 */
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Validation schema for creating a new incident (POST /incidents)
 * Strict mode prevents unwanted properties like status, severity, createdBy, assignedTo.
 */
export const createIncidentSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(3, 'Title must be at least 3 characters long')
      .max(100, 'Title cannot exceed 100 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters long')
      .max(2000, 'Description cannot exceed 2000 characters'),
    category: z.enum(
      Object.values(INCIDENT_CATEGORY) as [IncidentCategory, ...IncidentCategory[]],
      {
        errorMap: () => ({ message: 'Invalid incident category' }),
      },
    ),
    latitude: z
      .number({ required_error: 'Latitude is required' })
      .min(-90, 'Latitude must be between -90 and 90')
      .max(90, 'Latitude must be between -90 and 90'),
    longitude: z
      .number({ required_error: 'Longitude is required' })
      .min(-180, 'Longitude must be between -180 and 180')
      .max(180, 'Longitude must be between -180 and 180'),
    address: z.string().trim().max(255, 'Address cannot exceed 255 characters').optional(),
  })
  .strict();

/**
 * Validation schema for incident query parameters (GET /incidents)
 * Uses z.coerce to safely parse numeric values from URL search params.
 */
export const incidentQuerySchema = z
  .object({
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a valid number' })
      .int('Page must be an integer')
      .min(1, 'Page must be at least 1')
      .default(1),
    limit: z.coerce
      .number({ invalid_type_error: 'Limit must be a valid number' })
      .int('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit cannot exceed 100')
      .default(20),
    status: z
      .enum(Object.values(INCIDENT_STATUS) as [IncidentStatus, ...IncidentStatus[]], {
        errorMap: () => ({ message: 'Invalid incident status filter' }),
      })
      .optional(),
    severity: z
      .enum(Object.values(INCIDENT_SEVERITY) as [IncidentSeverity, ...IncidentSeverity[]], {
        errorMap: () => ({ message: 'Invalid incident severity filter' }),
      })
      .optional(),
    category: z
      .enum(Object.values(INCIDENT_CATEGORY) as [IncidentCategory, ...IncidentCategory[]], {
        errorMap: () => ({ message: 'Invalid incident category filter' }),
      })
      .optional(),
  })
  .strict();

/**
 * Validation schema for incident ID route parameters (GET /incidents/:id)
 */
export const incidentIdParamSchema = z
  .object({
    id: z
      .string({ required_error: 'Incident ID is required' })
      .trim()
      .regex(OBJECT_ID_REGEX, 'Invalid incident ID format'),
  })
  .strict();

export type IncidentQueryInput = z.infer<typeof incidentQuerySchema>;
export type IncidentIdParamInput = z.infer<typeof incidentIdParamSchema>;
