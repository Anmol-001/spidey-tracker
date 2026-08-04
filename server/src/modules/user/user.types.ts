import { Document, Model, Types } from 'mongoose';

/**
 * Supported User Roles across the platform
 */
export const USER_ROLES = {
  CITIZEN: 'citizen',
  RESPONDER: 'responder',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Base User domain entity representation
 */
export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Document interface for User
 */
export interface IUserDocument extends IUser, Document<Types.ObjectId> {
  _id: Types.ObjectId;
}

/**
 * Mongoose Model interface for User
 */
export type IUserModel = Model<IUserDocument>;

/**
 * Sanitized user response data transfer object (DTO)
 */
export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
