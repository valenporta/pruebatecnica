const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Requiere rol de administrador' });
  }
  next();
};

module.exports = isAdmin;
