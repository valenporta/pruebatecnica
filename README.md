# Prueba Tecnica - Sistema de Gestion de Roles

Aplicacion fullstack con autenticacion JWT, gestion de roles con permisos diferenciados (admin/general).

## Prerequisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.0

### 1. Crear la base de datos MySQL

```sql
CREATE DATABASE pruebatecnica;
```

### 2. Poblar la base de datos (seed)

```bash
cd backend
npm run seed
```

Esto crea los roles y usuarios de prueba:

| Rol     | CUIL        | Password    |
|---------|-------------|-------------|
| Admin   | 20304050607 | admin123    |
| General | 20112233445 | general123  |

## Tests

```bash
cd backend
npm test
```

Ejecuta los tests de integracion de la API con Jest + Supertest. No requiere base de datos (los modelos se mockean).

## Endpoints de la API

| Metodo | Ruta              | Auth         | Descripcion          |
|--------|-------------------|--------------|----------------------|
| POST   | /api/auth/login   | No           | Iniciar sesion       |
| POST   | /api/auth/refresh | No           | Renovar token        |
| GET    | /api/roles        | No           | Listar roles         |
| POST   | /api/roles        | Admin        | Crear rol            |
| PUT    | /api/roles/:id    | Admin        | Actualizar rol       |
| DELETE | /api/roles/:id    | Admin        | Eliminar rol         |

## Tecnologias

**Backend:** Express 5, Sequelize, MySQL2, JSON Web Tokens

**Frontend:** React 19, React Router 7, Vite 8

**Testing:** Jest, Supertest
