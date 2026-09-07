import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '../../helpers/request.helper.js';
import { createAuthenticatedUser } from '../../helpers/auth.helper.js';
import { Incident } from '../../../src/modules/incident/incident.model.js';

describe('GET /api/v1/incidents (Incident Listing & Query)', () => {
  let authHeaders: { Authorization: string };
  let userId: string;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser('citizen');
    authHeaders = auth.headers;
    userId = auth.user._id.toString();

    // Seed test incidents with distinct categories, severities, and timestamps
    await Incident.create([
      {
        title: 'Robbery at Queens Boulevard Store',
        description: 'Two armed suspects attempted to rob a store.',
        category: 'crime',
        severity: 'medium',
        status: 'open',
        latitude: 40.7282,
        longitude: -73.7949,
        createdBy: userId,
        createdAt: new Date('2026-08-01T10:00:00.000Z'),
      },
      {
        title: 'Major 3-Alarm Building Fire',
        description: 'Apartment complex engulfed in flames.',
        category: 'fire',
        severity: 'critical',
        status: 'in_progress',
        latitude: 40.7589,
        longitude: -73.9851,
        createdBy: userId,
        createdAt: new Date('2026-08-01T11:00:00.000Z'),
      },
      {
        title: 'Multi-car collision on expressway',
        description: 'Three vehicles involved in a pileup during rush hour.',
        category: 'accident',
        severity: 'high',
        status: 'open',
        latitude: 40.7128,
        longitude: -74.006,
        createdBy: userId,
        createdAt: new Date('2026-08-01T12:00:00.000Z'),
      },
    ]);
  });

  it('should list all incidents with default pagination parameters (200 OK)', async () => {
    const res = await api.get('/api/v1/incidents').set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(3);
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(20);
    expect(res.body.data.pagination.total).toBe(3);
    expect(res.body.data.pagination.totalPages).toBe(1);
  });

  it('should support custom page and limit pagination', async () => {
    const res = await api.get('/api/v1/incidents?page=1&limit=2').set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(2);
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(2);
    expect(res.body.data.pagination.hasNextPage).toBe(true);
    expect(res.body.data.pagination.hasPrevPage).toBe(false);
  });

  it('should filter incidents by category', async () => {
    const res = await api.get('/api/v1/incidents?category=fire').set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].category).toBe('fire');
    expect(res.body.data.items[0].title).toContain('3-Alarm');
  });

  it('should filter incidents by severity', async () => {
    const res = await api.get('/api/v1/incidents?severity=critical').set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].severity).toBe('critical');
  });

  it('should filter incidents by status', async () => {
    const res = await api.get('/api/v1/incidents?status=in_progress').set(authHeaders).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].status).toBe('in_progress');
  });

  it('should sort incidents newest-first by default (-createdAt)', async () => {
    const res = await api.get('/api/v1/incidents').set(authHeaders).expect(200);

    const items = res.body.data.items;
    expect(items[0].title).toContain('Multi-car collision'); // 12:00
    expect(items[1].title).toContain('3-Alarm'); // 11:00
    expect(items[2].title).toContain('Robbery'); // 10:00
  });

  it('should reject unauthenticated request with 401 Unauthorized', async () => {
    const res = await api.get('/api/v1/incidents').expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
