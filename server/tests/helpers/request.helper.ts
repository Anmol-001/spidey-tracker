import supertest from 'supertest';
import { app } from '../../src/app.js';

/**
 * Supertest request instance bound to the Express app.
 * Does not bind or start the HTTP server network listener.
 */
export const api = supertest(app);
