import { describe, it, expect } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';
import { buildIncidentPayload } from '../../fixtures/incident.fixture.js';

describe('POST /api/v1/incidents (Incident Creation)', () => {
  it('should allow authenticated citizen to report an incident with server-owned defaults (201 Created)', async () => {
    const { user, headers } = await createAuthenticatedUser('citizen');
    const payload = buildIncidentPayload();

    const res = await api.post('/api/v1/incidents').set(headers).send(payload).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Incident reported successfully');
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.description).toBe(payload.description);
    expect(res.body.data.category).toBe(payload.category);
    expect(res.body.data.latitude).toBe(payload.latitude);
    expect(res.body.data.longitude).toBe(payload.longitude);
    expect(res.body.data.address).toBe(payload.address);

    // Mandatory server-owned domain invariants
    expect(res.body.data.status).toBe('open');
    expect(res.body.data.severity).toBe('medium');
    expect(res.body.data.assignedTo).toBeNull();
    expect(res.body.data.createdBy).toBe(user._id.toString());
  });

  it('should reject unauthenticated incident creation with 401 Unauthorized', async () => {
    const payload = buildIncidentPayload();

    const res = await api.post('/api/v1/incidents').send(payload).expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should reject client attempts to inject server-owned fields (400 Bad Request)', async () => {
    const { headers } = await createAuthenticatedUser('citizen');
    const payload = {
      ...buildIncidentPayload(),
      status: 'resolved',
      severity: 'critical',
      assignedTo: '66b1a2c3d4e5f6a7b8c9d0e1',
      createdBy: '66b1a2c3d4e5f6a7b8c9d0e1',
    };

    const res = await api.post('/api/v1/incidents').set(headers).send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should reject invalid category enum value (400 Bad Request)', async () => {
    const { headers } = await createAuthenticatedUser('citizen');
    const payload = buildIncidentPayload({ category: 'alien_attack' as any });

    const res = await api.post('/api/v1/incidents').set(headers).send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should reject out-of-bounds geographic coordinates (400 Bad Request)', async () => {
    const { headers } = await createAuthenticatedUser('citizen');
    const payload = buildIncidentPayload({ latitude: 120, longitude: -200 });

    const res = await api.post('/api/v1/incidents').set(headers).send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('should reject title that is too short (400 Bad Request)', async () => {
    const { headers } = await createAuthenticatedUser('citizen');
    const payload = buildIncidentPayload({ title: 'ab' });

    const res = await api.post('/api/v1/incidents').set(headers).send(payload).expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});
