const jwt = require('jsonwebtoken');
const { secret, expiresIn, refreshSecret, refreshExpiresIn } = require('../config/auth');
const { Usuario } = require('../models');

const login = async (req, res) => {
  try {
    const { cuil, password } = req.body;

    if (!cuil || !password) {
      return res.status(400).json({ message: 'CUIL y password son requeridos' });
    }

    const usuario = await Usuario.findByPk(cuil);
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    if (password !== usuario.password) {
      return res.status(401).json({ message: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { cuil: usuario.cuil, rol: usuario.rol },
      secret,
      { expiresIn }
    );

    const refreshToken = jwt.sign(
      { cuil: usuario.cuil, rol: usuario.rol },
      refreshSecret,
      { expiresIn: refreshExpiresIn }
    );

    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token es requerido' });
    }

    const decoded = jwt.verify(refreshToken, refreshSecret);

    const token = jwt.sign(
      { cuil: decoded.cuil, rol: decoded.rol },
      secret,
      { expiresIn }
    );

    const newRefreshToken = jwt.sign(
      { cuil: decoded.cuil, rol: decoded.rol },
      refreshSecret,
      { expiresIn: refreshExpiresIn }
    );

    return res.status(200).json({ token, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token invalido o expirado' });
  }
};

module.exports = { login, refresh };
