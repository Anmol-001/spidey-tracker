import { Schema, model, models } from 'mongoose';
import { INCIDENT_STATUS, INCIDENT_CATEGORY, INCIDENT_SEVERITY } from './incident.constants.js';
import { IIncidentDocument, IIncidentModel } from './incident.types.js';

const incidentSchema = new Schema<IIncidentDocument, IIncidentModel>(
  {
    title: {
      type: String,
      required: [true, 'Incident title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Incident description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Incident category is required'],
      enum: {
        values: Object.values(INCIDENT_CATEGORY),
        message: 'Invalid incident category: {VALUE}',
      },
      index: true,
    },
    severity: {
      type: String,
      enum: {
        values: Object.values(INCIDENT_SEVERITY),
        message: 'Invalid incident severity: {VALUE}',
      },
      default: INCIDENT_SEVERITY.MEDIUM,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(INCIDENT_STATUS),
        message: 'Invalid incident status: {VALUE}',
      },
      default: INCIDENT_STATUS.OPEN,
      index: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [255, 'Address cannot exceed 255 characters'],
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator User reference is required'],
      index: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        return ret;
      },
    },
  },
);

// Explicit index on createdAt for chronological feeds
incidentSchema.index({ createdAt: -1 });

// Compound index for feed filtering and ordering
incidentSchema.index({ status: 1, createdAt: -1 });

export const Incident =
  (models['Incident'] as IIncidentModel) ||
  model<IIncidentDocument, IIncidentModel>('Incident', incidentSchema, 'incidents');
