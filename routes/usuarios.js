// routes/usuarios.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los usuarios que no sean clientes (id_rol != 5)
router.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.email, u.estado, r.nombre_rol
       FROM usuarios u
       JOIN roles r ON u.id_rol = r.id_rol
       WHERE u.id_rol != 5`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});


router.get('/api/contagem-cargos', async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT r.nombre_rol AS cargo, COUNT(*) AS total
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.estado = 1
      GROUP BY r.nombre_rol
    `);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao obter contagem de cargos' });
  }
});

// PUT para atualizar funcionário
router.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, estado } = req.body;

  try {
    const [rolResult] = await db.query('SELECT id_rol FROM roles WHERE nombre_rol = ?', [rol]);
    if (!rolResult.length) return res.status(400).json({ error: 'Rol inválido' });

    const id_rol = rolResult[0].id_rol;

    await db.query(
      'UPDATE usuarios SET nombre = ?, email = ?, id_rol = ?, estado = ? WHERE id_usuario = ?',
      [nombre, email, id_rol, estado, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar funcionário' });
  }
});
// DELETE para apagar funcionário
router.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao eliminar funcionário' });
  }
});

module.exports = router;