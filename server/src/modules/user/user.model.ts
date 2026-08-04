import { Schema, model } from 'mongoose';
import { IUserDocument, IUserModel, USER_ROLES } from './user.types.js';

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: [USER_ROLES.CITIZEN, USER_ROLES.RESPONDER, USER_ROLES.ADMIN],
        message: 'Invalid user role: {VALUE}',
      },
      default: USER_ROLES.CITIZEN,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['passwordHash'];
        ret['id'] = ret['_id'];
        delete ret['_id'];
        return ret;
      },
    },
  },
);

export const User = model<IUserDocument, IUserModel>('User', userSchema, 'users');
