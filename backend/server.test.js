import { jest, describe, it, expect } from '@jest/globals';

describe('API Server', () => {
  beforeEach(() => {
    // Reset modules before each test to ensure a clean slate for mocking
    jest.resetModules();
  });

  it('GET /healthz should return a healthy status', async () => {
    const app = (await import('./app.js')).default;
    const request = (await import('supertest')).default;

    const response = await request(app)
      .get('/healthz')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe('healthy');
  });

  it('GET /api/employees should return a list of employees from a mocked database', async () => {
    // 1. Set up the mock using the recommended API for ESM
    jest.unstable_mockModule('./lib/supabaseClient.js', () => ({
      supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [{ id: 99, name: 'Unstable Mock Employee' }],
          error: null,
        }),
      },
    }));

    // 2. Dynamically import modules AFTER mocking
    const app = (await import('./app.js')).default;
    const request = (await import('supertest')).default;
    const { supabase } = await import('./lib/supabaseClient.js');

    // 3. Run the test
    const response = await request(app)
      .get('/api/employees')
      .expect('Content-Type', /json/)
      .expect(200);

    // 4. Assertions
    expect(response.body).toEqual([{ id: 99, name: 'Unstable Mock Employee' }]);
    expect(supabase.from).toHaveBeenCalledWith('customers');
  });
});