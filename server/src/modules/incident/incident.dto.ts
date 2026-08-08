import { IncidentCategory, IncidentSeverity, IncidentStatus } from './incident.types.js';

/**
 * Data Transfer Object for creating a new incident (Client Request)
 */
export interface CreateIncidentDto {
  title: string;
  description: string;
  category: IncidentCategory;
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * Data Transfer Object for incident responses (Sanitized API Output)
 */
export interface IncidentResponseDto {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address?: string | null;
  createdBy: string;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}
