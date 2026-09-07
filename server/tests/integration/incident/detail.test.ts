import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';
import { Incident } from '../../../src/modules/incident/incident.model.js';

describe('GET /api/v1/incidents/:id (Incident Detail)', () => {
  let authHeaders: { Authorization: string };
  let incidentId: string;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser('citizen');
    authHeaders = auth.headers;

    const doc = await Incident.create({
      title: 'Hostage situation at Midtown Bank',
      description: 'Multiple hostages held inside vault area.',
      category: 'crime',
      severity: 'critical',
      status: 'open',
      latitude: 40.758,
      longitude: -73.9855,
      createdBy: auth.user._id,
    });
    incidentId = doc._id.toString();
  });

  it('should return incident details for a valid existing incident ID (200 OK)', async () => {
    const res = await api.get(`/api/v1/incidents/${incidentId}`).set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Incident retrieved successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(incidentId);
    expect(res.body.data.title).toContain('Hostage situation');
    expect(res.body.data.severity).toBe('critical');
    expect(res.body.data.status).toBe('open');
    expect(res.body.data.__v).toBeUndefined();
  });

  it('should return 404 Not Found for a valid but non-existent ObjectId', async () => {
    const nonExistentId = '66b1a2c3d4e5f6a7b8c9d999';

    const res = await api.get(`/api/v1/incidents/${nonExistentId}`).set(authHeaders).expect(404);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Incident not found');
  });

  it('should return 400 Bad Request for a malformed ObjectId', async () => {
    const res = await api.get('/api/v1/incidents/invalid-hex-id').set(authHeaders).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const res = await api.get(`/api/v1/incidents/${incidentId}`).expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
