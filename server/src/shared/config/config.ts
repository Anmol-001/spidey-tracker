import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/spidey_tracker'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['info', 'warn', 'error', 'debug']).default('info'),
  JWT_ACCESS_SECRET: z
    .string({ required_error: 'JWT_ACCESS_SECRET is required' })
    .min(1, 'JWT_ACCESS_SECRET cannot be empty'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const config = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  isProduction: parsedEnv.data.NODE_ENV === 'production',
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isTest: parsedEnv.data.NODE_ENV === 'test',
  port: parsedEnv.data.PORT,
  mongoUri: parsedEnv.data.MONGODB_URI,
  corsOrigin: parsedEnv.data.CORS_ORIGIN,
  logLevel: parsedEnv.data.LOG_LEVEL,
  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtAccessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES_IN,
} as const;

export type Config = typeof config;
