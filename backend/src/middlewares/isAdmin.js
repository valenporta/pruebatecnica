const isAdmin = (req, res, next) => {
  if (req.user.rol !== 1) {
    return res.status(403).json({ message: 'Requiere rol de administrador' });
  }
  next();
};

module.exports = isAdmin;
