const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const { Role } = require('../src/models');
const app = require('../server');

jest.mock('../src/models', () => ({
  sequelize: { sync: jest.fn() },
  Usuario: {},
  Role: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
}));

const adminToken = jwt.sign({ cuil: '20304050607', rol: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
const generalToken = jwt.sign({ cuil: '20112233445', rol: 2 }, process.env.JWT_SECRET, { expiresIn: '1h' });

// ─── GET /api/roles (publico) ───────────────────────────────────────

describe('GET /api/roles', () => {
  afterEach(() => jest.clearAllMocks());

  it('200 - retorna lista de roles sin necesidad de token', async () => {
    Role.findAll.mockResolvedValue([
      { id: 1, descripcion: 'ADMIN' },
      { id: 2, descripcion: 'GENERAL' },
    ]);

    const res = await request(app).get('/api/roles');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].descripcion).toBe('ADMIN');
  });
});

// ─── POST /api/roles (requiere token admin) ─────────────────────────

describe('POST /api/roles', () => {
  afterEach(() => jest.clearAllMocks());

  it('201 - crea rol con token admin', async () => {
    Role.create.mockResolvedValue({ id: 3, descripcion: 'NUEVO' });

    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descripcion: 'NUEVO' });

    expect(res.status).toBe(201);
    expect(res.body.descripcion).toBe('NUEVO');
  });

  it('400 - falta descripcion con token admin', async () => {
    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/descripcion es requerida/);
  });

  it('401 - sin token', async () => {
    const res = await request(app)
      .post('/api/roles')
      .send({ descripcion: 'NUEVO' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token no proporcionado/);
  });

  it('401 - token invalido', async () => {
    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', 'Bearer token-invalido')
      .send({ descripcion: 'NUEVO' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token invalido/);
  });

  it('403 - token de usuario general (no admin)', async () => {
    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${generalToken}`)
      .send({ descripcion: 'NUEVO' });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Requiere rol de administrador/);
  });
});

// ─── PUT /api/roles/:id (requiere token admin) ─────────────────────

describe('PUT /api/roles/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('200 - actualiza rol con token admin', async () => {
    const mockRole = { id: 1, descripcion: 'ADMIN', update: jest.fn().mockResolvedValue() };
    mockRole.update.mockImplementation(function (data) { Object.assign(this, data); });
    Role.findByPk.mockResolvedValue(mockRole);

    const res = await request(app)
      .put('/api/roles/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descripcion: 'SUPERADMIN' });

    expect(res.status).toBe(200);
    expect(mockRole.update).toHaveBeenCalledWith({ descripcion: 'SUPERADMIN' });
  });

  it('400 - falta descripcion', async () => {
    const res = await request(app)
      .put('/api/roles/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/descripcion es requerida/);
  });

  it('404 - rol no encontrado', async () => {
    Role.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/roles/999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ descripcion: 'X' });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Rol no encontrado/);
  });

  it('401 - sin token', async () => {
    const res = await request(app)
      .put('/api/roles/1')
      .send({ descripcion: 'X' });

    expect(res.status).toBe(401);
  });

  it('403 - token de usuario general', async () => {
    const res = await request(app)
      .put('/api/roles/1')
      .set('Authorization', `Bearer ${generalToken}`)
      .send({ descripcion: 'X' });

    expect(res.status).toBe(403);
  });
});

// ─── DELETE /api/roles/:id (requiere token admin) ───────────────────

describe('DELETE /api/roles/:id', () => {
  afterEach(() => jest.clearAllMocks());

  it('200 - elimina rol con token admin', async () => {
    const mockRole = { id: 3, descripcion: 'TEMPORAL', destroy: jest.fn().mockResolvedValue() };
    Role.findByPk.mockResolvedValue(mockRole);

    const res = await request(app)
      .delete('/api/roles/3')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Rol eliminado/);
    expect(mockRole.destroy).toHaveBeenCalled();
  });

  it('404 - rol no encontrado', async () => {
    Role.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .delete('/api/roles/999')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/Rol no encontrado/);
  });

  it('401 - sin token', async () => {
    const res = await request(app)
      .delete('/api/roles/1');

    expect(res.status).toBe(401);
  });

  it('403 - token de usuario general', async () => {
    const res = await request(app)
      .delete('/api/roles/1')
      .set('Authorization', `Bearer ${generalToken}`);

    expect(res.status).toBe(403);
  });
});
