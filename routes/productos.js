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

// GET /api/productos/:id
router.get('/api/productos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT id_producto, nombre_producto, stock_actual, precio, imagen, puntos_por_unidad
      FROM productos
      WHERE id_producto = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});


router.post('/api/produtos', async (req, res) => {
  const { nombre_producto, stock_actual, precio, puntos_por_unidad = 0, imagen } = req.body;

  if (!nombre_producto || !stock_actual || !precio) {
    return res.status(400).json({ message: 'Campos obrigatórios em falta.' });
  }

  try {
    const [result] = await db.query(`
      INSERT INTO productos (nombre_producto, stock_actual, precio, puntos_por_unidad, imagen)
      VALUES (?, ?, ?, ?, ?)
    `, [nombre_producto, stock_actual, precio, puntos_por_unidad, imagen]);

    res.status(201).json({ id: result.insertId, message: 'Produto adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    res.status(500).json({ message: 'Erro ao inserir produto' });
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
