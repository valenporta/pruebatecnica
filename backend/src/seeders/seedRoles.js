require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { sequelize, Role, Usuario } = require('../models');

async function seed() {
  try {
    await sequelize.sync();

    await Role.bulkCreate(
      [
        { id: 1, descripcion: 'ADMIN' },
        { id: 2, descripcion: 'GENERAL' },
      ],
      { ignoreDuplicates: true }
    );
    console.log('Roles creados: ADMIN, GENERAL');

    await Usuario.findOrCreate({
      where: { cuil: '20304050607' },
      defaults: {
        rol: 1,
        password: 'admin123',
      },
    });
    console.log('Usuario admin creado: cuil 20304050607, password admin123');

    await Usuario.findOrCreate({
      where: { cuil: '20112233445' },
      defaults: {
        rol: 2,
        password: 'general123',
      },
    });
    console.log('Usuario general creado: cuil 20112233445, password general123');

    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    process.exit(1);
  }
}

seed();
