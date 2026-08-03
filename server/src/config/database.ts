import mongoose from 'mongoose';
import { config } from './config.js';
import { logger } from './logger.js';

interface DatabaseConnection {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
}

class DatabaseManager implements DatabaseConnection {
  private isDbConnected = false;

  constructor() {
    mongoose.connection.on('connected', () => {
      this.isDbConnected = true;
      logger.info('📦 MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err: unknown) => {
      this.isDbConnected = false;
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      this.isDbConnected = false;
      logger.warn('⚠️ MongoDB disconnected');
    });
  }

  public async connect(): Promise<void> {
    try {
      logger.info(`🔌 Connecting to MongoDB at ${config.mongoUri}...`);
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
        autoIndex: !config.isProduction,
      });
      this.isDbConnected = true;
    } catch (error: unknown) {
      this.isDbConnected = false;
      logger.warn(
        '⚠️ Initial MongoDB connection failed. Server running in standalone mode.',
        error,
      );
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isDbConnected) {
      await mongoose.disconnect();
      this.isDbConnected = false;
      logger.info('📦 MongoDB connection closed gracefully');
    }
  }

  public isConnected(): boolean {
    return this.isDbConnected && mongoose.connection.readyState === 1;
  }
}

export const database = new DatabaseManager();
