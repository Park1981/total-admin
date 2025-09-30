import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import bcrypt from 'bcrypt';

describe('API Server', () => {
  beforeEach(() => {
    // Reset modules before each test to ensure a clean slate for mocking
    jest.resetModules();
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  const buildSupabaseStub = (listData = []) => {
    const mutationResponse = (data = null) => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data, error: null }))
      })),
      single: jest.fn(() => Promise.resolve({ data, error: null }))
    });

    const buildFilteredRows = filters => {
      return listData.filter(row => {
        return Object.entries(filters).every(([key, value]) => row[key] === value);
      });
    };

    const createChain = () => {
      const filters = {};

      const resolveRows = () => buildFilteredRows(filters);

      const chain = {};

      chain.select = jest.fn(() => chain);
      chain.eq = jest.fn((field, value) => {
        filters[field] = value;
        return chain;
      });
      chain.order = jest.fn(() => Promise.resolve({ data: resolveRows(), error: null }));
      chain.insert = jest.fn(rows => mutationResponse(Array.isArray(rows) ? rows[0] ?? null : rows));
      chain.update = jest.fn(payload => mutationResponse(payload ?? null));
      chain.delete = jest.fn(() => mutationResponse(null));
      chain.single = jest.fn(() => Promise.resolve({ data: resolveRows()[0] ?? null, error: null }));
      chain.maybeSingle = jest.fn(() => Promise.resolve({ data: resolveRows()[0] ?? null, error: null }));

      return chain;
    };

    return {
      supabase: {
        from: jest.fn(() => createChain())
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

  it('POST /api/employees/login issues JWT tokens when credentials are valid', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    const mockEmployees = [{
      employee_id: 101,
      username: 'valid-user',
      password_hash: passwordHash,
      role: 'admin',
      name: 'Valid User',
      active: true
    }];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    const response = await request(app)
      .post('/api/employees/login')
      .send({ username: 'valid-user', password: 'correct-password' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
    expect(response.body.tokenType).toBe('Bearer');
    expect(response.body.user).toMatchObject({ username: 'valid-user', employee_id: 101 });
  });

  it('POST /api/employees/login rejects invalid credentials', async () => {
    const passwordHash = await bcrypt.hash('correct-password', 10);
    const mockEmployees = [{
      employee_id: 102,
      username: 'invalid-user',
      password_hash: passwordHash,
      role: 'staff',
      name: 'Invalid User',
      active: true
    }];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    await request(app)
      .post('/api/employees/login')
      .send({ username: 'invalid-user', password: 'wrong-password' })
      .expect(401);
  });

  it('GET /api/employees responds with 401 when Authorization header is missing', async () => {
    const { app, request } = await loadAppWithSupabaseMock();

    await request(app)
      .get('/api/employees')
      .expect(401);
  });

  it('GET /api/employees returns data when supplied with a valid access token', async () => {
    const passwordHash = await bcrypt.hash('secret', 10);
    const mockEmployees = [{
      employee_id: 103,
      username: 'token-user',
      password_hash: passwordHash,
      role: 'manager',
      name: 'Token User',
      active: true
    }];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    const loginResponse = await request(app)
      .post('/api/employees/login')
      .send({ username: 'token-user', password: 'secret' })
      .expect(200);

    const response = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ employee_id: 103 })
    ]));
  });

  it('GET /api/employees returns 403 for staff role without privileges', async () => {
    const passwordHash = await bcrypt.hash('staff-pass', 10);
    const mockEmployees = [{
      employee_id: 201,
      username: 'staff-user',
      password_hash: passwordHash,
      role: 'staff',
      name: 'Staff User',
      active: true
    }];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    const loginResponse = await request(app)
      .post('/api/employees/login')
      .send({ username: 'staff-user', password: 'staff-pass' })
      .expect(200);

    await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(403);
  });

  it('POST /api/products/templates requires admin role', async () => {
    const staffPasswordHash = await bcrypt.hash('staff-secret', 10);
    const adminPasswordHash = await bcrypt.hash('admin-secret', 10);
    const mockEmployees = [
      {
        employee_id: 301,
        username: 'rbac-staff',
        password_hash: staffPasswordHash,
        role: 'staff',
        name: 'RBAC Staff',
        active: true
      },
      {
        employee_id: 302,
        username: 'rbac-admin',
        password_hash: adminPasswordHash,
        role: 'admin',
        name: 'RBAC Admin',
        active: true
      }
    ];
    const { app, request } = await loadAppWithSupabaseMock(mockEmployees);

    const staffLogin = await request(app)
      .post('/api/employees/login')
      .send({ username: 'rbac-staff', password: 'staff-secret' })
      .expect(200);

    await request(app)
      .post('/api/products/templates')
      .set('Authorization', `Bearer ${staffLogin.body.accessToken}`)
      .send({ template_code: 'TEMP-001', template_name: 'Temp', category: 'Default' })
      .expect(403);

    const adminLogin = await request(app)
      .post('/api/employees/login')
      .send({ username: 'rbac-admin', password: 'admin-secret' })
      .expect(200);

    const createResponse = await request(app)
      .post('/api/products/templates')
      .set('Authorization', `Bearer ${adminLogin.body.accessToken}`)
      .send({ template_code: 'TEMP-002', template_name: 'Temp Admin', category: 'Default' })
      .expect(201);

    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data).toMatchObject({ template_code: 'TEMP-002' });
  });
});
