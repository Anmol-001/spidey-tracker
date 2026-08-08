import { Document, Model, Types } from 'mongoose';
import { INCIDENT_STATUS, INCIDENT_SEVERITY, INCIDENT_CATEGORY } from './incident.constants.js';

/**
 * Derived TypeScript union types for Incident enums
 */
export type IncidentStatus = (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];
export type IncidentSeverity = (typeof INCIDENT_SEVERITY)[keyof typeof INCIDENT_SEVERITY];
export type IncidentCategory = (typeof INCIDENT_CATEGORY)[keyof typeof INCIDENT_CATEGORY];

/**
 * Base Incident Domain Entity Interface
 */
export interface IIncident {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address?: string;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Document interface for Incident
 */
export interface IIncidentDocument extends IIncident, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

/**
 * Mongoose Model interface for Incident
 */
export type IIncidentModel = Model<IIncidentDocument>;
