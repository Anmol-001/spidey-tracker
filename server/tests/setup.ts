import { beforeAll, afterAll, beforeEach } from 'vitest';
import { connectTestDb, clearTestDb, disconnectTestDb } from './helpers/db.helper.js';

// Enforce test environment variables BEFORE config or app is loaded
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '5001';
process.env['JWT_ACCESS_SECRET'] = 'test-jwt-access-secret-32-chars-long-minimum!';
process.env['JWT_ACCESS_EXPIRES_IN'] = '15m';
process.env['CORS_ORIGIN'] = 'http://localhost:5173';
process.env['LOG_LEVEL'] = 'error';

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});
