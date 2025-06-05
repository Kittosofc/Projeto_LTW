// middlewares/auth.js
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  req.id_cliente = req.session.usuario.id_cliente; // Guarda id_cliente en req para usarlo en rutas
  next();
};

module.exports = authMiddleware;
