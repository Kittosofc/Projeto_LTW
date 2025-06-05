const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los clientes
router.get('/api/clientes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id_cliente, u.id_usuario, u.nombre AS nome, u.email, u.password_hash AS password, u.estado AS ativo,
       c.direccion AS direcao, c.telefono, c.fecha_registro AS registro,
       tf.puntos_actuales AS pontos

      FROM clientes c
      JOIN usuarios u ON c.id_usuario = u.id_usuario
      LEFT JOIN tarjetas_fidelidad tf ON c.id_cliente = tf.id_cliente
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

// Actualizar cliente
router.put('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, password, pontos, estado, direcao, telefone } = req.body;

  try {
    const [clienteRows] = await db.query('SELECT id_usuario FROM clientes WHERE id_cliente = ?', [id]);
    if (clienteRows.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });

    const id_usuario = clienteRows[0].id_usuario;

    // Atualizar usuário com password em texto plano
    await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, password_hash = ?, estado = ? WHERE id_usuario = ?',
      [nome, email, password, estado, id_usuario]
    );

    // Atualizar cliente
    await db.query(
      'UPDATE clientes SET direccion = ?, telefono = ? WHERE id_cliente = ?',
      [direcao, telefone, id]
    );

    // Atualizar pontos
    await db.query(
      'UPDATE tarjetas_fidelidad SET puntos_actuales = ? WHERE id_cliente = ?',
      [pontos, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [[cliente]] = await db.query(`SELECT id_usuario FROM clientes WHERE id_cliente = ?`, [id]);
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    const id_usuario = cliente.id_usuario;

    await db.query(`DELETE FROM canjes_pontos WHERE id_cliente = ?`, [id]);
    await db.query(`DELETE FROM tarjetas_fidelidad WHERE id_cliente = ?`, [id]);
    await db.query(`DELETE FROM ventas WHERE id_cliente = ?`, [id]);
    await db.query(`DELETE FROM agendamientos WHERE id_cliente = ?`, [id]);
    await db.query(`DELETE FROM clientes WHERE id_cliente = ?`, [id]);
    await db.query(`DELETE FROM usuarios WHERE id_usuario = ?`, [id_usuario]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar cliente' });
  }
});

module.exports = router;
