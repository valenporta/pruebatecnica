const { Role } = require('../models');

const createRole = async (req, res) => {
  try {
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({ message: 'La descripcion es requerida' });
    }

    const role = await Role.create({ descripcion });
    return res.status(201).json(role);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({ message: 'La descripcion es requerida' });
    }

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await role.update({ descripcion });
    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await role.destroy();
    return res.status(200).json({ message: 'Rol eliminado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { createRole, getRoles, updateRole, deleteRole };
