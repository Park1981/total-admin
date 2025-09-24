import { jest, describe, it, expect } from '@jest/globals';

describe('API Server', () => {
  beforeEach(() => {
    // Reset modules before each test to ensure a clean slate for mocking
    jest.resetModules();
  });

  const buildSupabaseStub = (listData = []) => {
    const defaultResponse = { data: listData, error: null };
    const mutationResponse = (data = null) => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data, error: null }))
      })),
      single: jest.fn(() => Promise.resolve({ data, error: null }))
    });

    const chain = {
      select: jest.fn(() => chain),
      eq: jest.fn(() => chain),
      order: jest.fn(() => Promise.resolve(defaultResponse)),
      insert: jest.fn(rows => mutationResponse(Array.isArray(rows) ? rows[0] ?? null : rows)),
      update: jest.fn(payload => mutationResponse(payload ?? null)),
      delete: jest.fn(() => mutationResponse(null)),
      single: jest.fn(() => Promise.resolve({ data: listData[0] ?? null, error: null })),
      maybeSingle: jest.fn(() => Promise.resolve({ data: listData[0] ?? null, error: null }))
    };

    return {
      supabase: {
        from: jest.fn(() => chain)
      }
    };
  };

  async function loadAppWithSupabaseMock(listData = []) {
    jest.unstable_mockModule('./lib/supabaseClient.js', () => buildSupabaseStub(listData));
    const app = (await import('./app.js')).default;
    const request = (await import('supertest')).default;
    return { app, request };
  }

  it('GET /healthz should return a healthy status', async () => {
    const { app, request } = await loadAppWithSupabaseMock();

    const response = await request(app)
      .get('/healthz')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe('healthy');
  });

  it('GET /api/employees should return a list of employees from a mocked database', async () => {
    const mockEmployees = [{ id: 99, name: 'Unstable Mock Employee' }];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    const response = await request(app)
      .get('/api/employees')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(mockEmployees);
  });
});
