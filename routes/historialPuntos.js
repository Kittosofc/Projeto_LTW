const express = require('express');
const router = express.Router();
const db = require('../db'); // módulo para conexión MySQL, ajusta según tu proyecto

// Middleware para autenticar y obtener id_cliente
// Por ejemplo, si usas JWT o sesión
const authMiddleware = (req, res, next) => {
  // Aquí deberías obtener el id_cliente real según tu auth
  // Para ejemplo, ponemos un id fijo:
  req.id_cliente = 1; 
  next();
};

router.use(authMiddleware);

router.get('/', (req, res) => {
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

  db.query(query, [id_cliente], (err, results) => {
    if (err) {
      console.error('Error al obtener historial de puntos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    res.json(results);
  });
});

module.exports = router;
