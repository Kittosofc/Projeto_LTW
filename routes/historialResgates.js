const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a BD
const authMiddleware = require('../middlewares/auth');  // <-- Importa el middleware


// Ruta para registrar canje
// Ejemplo en el endpoint canje:
router.post('/canjear', authMiddleware, async (req, res) => {
  const id_cliente = req.id_cliente;
  const { id_producto_canje, puntos_utilizados } = req.body;

  if (!id_producto_canje || !puntos_utilizados) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const queryInsert = `
    INSERT INTO Canjes_Puntos (id_cliente, id_producto_canje, puntos_utilizados)
    VALUES (?, ?, ?)
  `;

  const queryActualizarPuntos = `
    UPDATE tarjetas_fidelidad SET puntos_actuales = puntos_actuales - ? WHERE id_cliente = ?
  `;

  try {
    await db.query(queryInsert, [id_cliente, id_producto_canje, puntos_utilizados]);
    await db.query(queryActualizarPuntos, [puntos_utilizados, id_cliente]);

    // Actualiza la sesión con el nuevo saldo de puntos
    if (req.session.usuario) {
      req.session.usuario.puntos_actuales -= puntos_utilizados;
    }

    res.json({ mensaje: 'Canje registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar canje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para obtener historial de canjes
router.get('/historial-canje', authMiddleware, async (req, res) => {
  const id_cliente = req.id_cliente;

  const query = `
    SELECT 
      cp.id_canje,
      pc.nombre_producto,
      pc.descripcion,
      cp.puntos_utilizados,
      cp.fecha_canje
    FROM Canjes_Puntos cp
    JOIN Productos_Canje pc ON cp.id_producto_canje = pc.id_producto_canje
    WHERE cp.id_cliente = ?
    ORDER BY cp.fecha_canje DESC
  `;

  try {
    const [resultados] = await db.query(query, [id_cliente]);
    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener historial de canjes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
