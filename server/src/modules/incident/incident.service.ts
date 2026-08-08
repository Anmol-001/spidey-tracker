import { Types } from 'mongoose';
import { Incident } from './incident.model.js';
import { CreateIncidentDto, IncidentResponseDto } from './incident.dto.js';
import { INCIDENT_STATUS, INCIDENT_SEVERITY } from './incident.constants.js';

/**
 * Incident Service handling business logic for incident management
 */
export class IncidentService {
  /**
   * Creates a new incident report with server-controlled defaults
   *
   * @param input - Validated client payload
   * @param userId - Unique identifier of the authenticated user creating the report
   * @returns Sanitized IncidentResponseDto
   */
  public async createIncident(
    input: CreateIncidentDto,
    userId: string,
  ): Promise<IncidentResponseDto> {
    const incident = await Incident.create({
      title: input.title,
      description: input.description,
      category: input.category,
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address ?? null,
      createdBy: new Types.ObjectId(userId),
      status: INCIDENT_STATUS.OPEN,
      severity: INCIDENT_SEVERITY.MEDIUM,
      assignedTo: null,
    });

    return {
      id: incident._id.toString(),
      title: incident.title,
      description: incident.description,
      category: incident.category,
      severity: incident.severity,
      status: incident.status,
      latitude: incident.latitude,
      longitude: incident.longitude,
      address: incident.address ?? null,
      createdBy: incident.createdBy.toString(),
      assignedTo: incident.assignedTo ? incident.assignedTo.toString() : null,
      createdAt: incident.createdAt.toISOString(),
      updatedAt: incident.updatedAt.toISOString(),
    };
  }
}

export const incidentService = new IncidentService();
