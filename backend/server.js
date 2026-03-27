require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const roleRoutes = require('./src/routes/roleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
 }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  }).catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
}

module.exports = app;
