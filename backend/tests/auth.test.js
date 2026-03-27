const request = require('supertest');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const { Usuario, Role } = require('../src/models');
const app = require('../server');

jest.mock('../src/models', () => ({
  sequelize: { sync: jest.fn() },
  Usuario: { findByPk: jest.fn() },
  Role: { findByPk: jest.fn() },
}));

describe('POST /api/auth/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('200 - login exitoso con usuario admin', async () => {
    Usuario.findByPk.mockResolvedValue({ cuil: '20304050607', password: 'admin123', rol: 1 });
    Role.findByPk.mockResolvedValue({ id: 1, descripcion: 'ADMIN' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ cuil: '20304050607', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.cuil).toBe('20304050607');
    expect(decoded.rol).toBe('ADMIN');
  });

  it('200 - login exitoso con usuario general', async () => {
    Usuario.findByPk.mockResolvedValue({ cuil: '20112233445', password: 'general123', rol: 2 });
    Role.findByPk.mockResolvedValue({ id: 2, descripcion: 'GENERAL' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ cuil: '20112233445', password: 'general123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded.rol).toBe('GENERAL');
  });

  it('400 - falta cuil', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'admin123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/CUIL y password son requeridos/);
  });

  it('400 - falta password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ cuil: '20304050607' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/CUIL y password son requeridos/);
  });

  it('401 - usuario no existe', async () => {
    Usuario.findByPk.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ cuil: '99999999999', password: 'abc' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Credenciales invalidas/);
  });

  it('401 - password incorrecta', async () => {
    Usuario.findByPk.mockResolvedValue({ cuil: '20304050607', password: 'admin123', rol: 1 });
    Role.findByPk.mockResolvedValue({ id: 1, descripcion: 'ADMIN' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ cuil: '20304050607', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Credenciales invalidas/);
  });
});

describe('POST /api/auth/refresh', () => {
  afterEach(() => jest.clearAllMocks());

  it('200 - refresh token valido retorna nuevos tokens', async () => {
    const refreshToken = jwt.sign(
      { cuil: '20304050607', rol: 'ADMIN' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('400 - falta refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Refresh token es requerido/);
  });

  it('401 - refresh token invalido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'token-invalido' });

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Refresh token invalido o expirado/);
  });

  it('401 - refresh token expirado', async () => {
    const expiredToken = jwt.sign(
      { cuil: '20304050607', rol: 'ADMIN' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '0s' }
    );

    // Esperar a que expire
    await new Promise((r) => setTimeout(r, 1100));

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: expiredToken });

    expect(res.status).toBe(401);
  });
});
