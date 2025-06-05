const express = require('express');
const router = express.Router();
const db = require('../db'); // Conexión promisificada


// Middleware para autenticar y obtener id_cliente
const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  req.id_cliente = req.session.usuario.id_cliente; // Aquí tomas el id_cliente real del usuario autenticado
  next();
};



router.use(authMiddleware);

router.get('/', async (req, res) => {
  const id_cliente = req.id_cliente;
  const query = `
    SELECT 
      v.id_venta,
      p.nombre_producto,
      p.precio,
      vp.cantidad,
      vp.puntos_otorgados,
      v.fecha_venta
    FROM Ventas v
    JOIN Ventas_Productos vp ON v.id_venta = vp.id_venta
    JOIN Productos p ON vp.id_producto = p.id_producto
    WHERE v.id_cliente = ?
    ORDER BY v.fecha_venta DESC;
  `;

  try {
    const [results] = await db.query(query, [id_cliente]);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener historial de puntos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


module.exports = router;
