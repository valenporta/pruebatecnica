const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  cuil: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
