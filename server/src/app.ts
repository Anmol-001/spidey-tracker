import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './shared/config/config.js';
import { notFoundHandler } from './shared/middleware/notFound.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { healthRouter } from './modules/health/health.route.js';
import { apiRouter } from './routes/index.js';

export function createApp(): Express {
  const app: Express = express();

  // Security Headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
  );

  // Payload Compression
  app.use(compression());

  // HTTP Request Logging
  if (!config.isTest) {
    app.use(morgan(config.isProduction ? 'combined' : 'dev'));
  }

  // Request Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Direct Health Route (GET /health)
  app.use('/health', healthRouter);

  // API Version 1 Routes (GET /api/v1/health, etc.)
  app.use('/api/v1', apiRouter);

  // 404 Catch-All Handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
