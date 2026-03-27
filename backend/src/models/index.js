const sequelize = require('../config/db');
const Role = require('./Role');
const Usuario = require('./Usuario');

Usuario.belongsTo(Role, { foreignKey: 'rol', targetKey: 'id' });
Role.hasMany(Usuario, { foreignKey: 'rol' });

module.exports = { sequelize, Role, Usuario };
