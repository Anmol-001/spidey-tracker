import { FilterQuery, Types } from 'mongoose';
import { Incident } from './incident.model.js';
import {
  CreateIncidentDto,
  IncidentResponseDto,
  PaginatedIncidentsResponseDto,
} from './incident.dto.js';
import { INCIDENT_STATUS, INCIDENT_SEVERITY } from './incident.constants.js';
import { IIncidentDocument } from './incident.types.js';
import { IncidentQueryInput } from './incident.validation.js';
import { ApiError } from '../../shared/utils/apiError.js';

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

  /**
   * Retrieves a paginated and filtered list of incident reports
   *
   * @param query - Validated query parameters containing pagination and filters
   * @returns Paginated incident list with metadata
   */
  public async getIncidents(query: IncidentQueryInput): Promise<PaginatedIncidentsResponseDto> {
    const filter: FilterQuery<IIncidentDocument> = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.severity) {
      filter.severity = query.severity;
    }
    if (query.category) {
      filter.category = query.category;
    }

    const skip = (query.page - 1) * query.limit;

    const [docs, total] = await Promise.all([
      Incident.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(query.limit)
        .lean()
        .exec(),
      Incident.countDocuments(filter).exec(),
    ]);

    const items: IncidentResponseDto[] = docs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      category: doc.category,
      severity: doc.severity,
      status: doc.status,
      latitude: doc.latitude,
      longitude: doc.longitude,
      address: doc.address ?? null,
      createdBy: doc.createdBy.toString(),
      assignedTo: doc.assignedTo ? doc.assignedTo.toString() : null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    const totalPages = total === 0 ? 1 : Math.ceil(total / query.limit);

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPrevPage: query.page > 1 && query.page <= totalPages + 1,
      },
    };
  }

  /**
   * Retrieves a single incident report by unique ID
   *
   * @param id - 24-character hexadecimal incident ID
   * @returns Sanitized IncidentResponseDto
   * @throws ApiError 404 if incident does not exist
   */
  public async getIncidentById(id: string): Promise<IncidentResponseDto> {
    const doc = await Incident.findById(id).lean().exec();

    if (!doc) {
      throw ApiError.notFound('Incident not found');
    }

    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      category: doc.category,
      severity: doc.severity,
      status: doc.status,
      latitude: doc.latitude,
      longitude: doc.longitude,
      address: doc.address ?? null,
      createdBy: doc.createdBy.toString(),
      assignedTo: doc.assignedTo ? doc.assignedTo.toString() : null,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }
}

export const incidentService = new IncidentService();
