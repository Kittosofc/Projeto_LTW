// routes/productos.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // conexão MySQL

router.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM productos`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});


router.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_producto, stock_actual, precio, pontos_por_unidad, imagen } = req.body;

  try {
    await db.query(
      'UPDATE productos SET nombre_producto = ?, stock_actual = ?, precio = ?, puntos_por_unidad = ?, imagen = ? WHERE id_producto = ?',
      [nombre_producto, stock_actual, precio, pontos_por_unidad, imagen, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao editar produto' });
  }
});


// PUT /api/productos/:id/stock
router.put('/api/productos/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    await db.query('UPDATE productos SET stock_actual = ? WHERE id_producto = ?', [stock, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar stock' });
  }
});

module.exports = router;
