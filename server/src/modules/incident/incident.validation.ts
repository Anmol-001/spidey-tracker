import { z } from 'zod';
import { INCIDENT_CATEGORY } from './incident.constants.js';
import { IncidentCategory } from './incident.types.js';

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
