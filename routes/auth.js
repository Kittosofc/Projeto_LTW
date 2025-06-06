const express = require('express');
const router = express.Router();
const authController = require('../auth/authController.js');
const db = require('../db');


router.post('/login', authController.login);

router.get('/api/usuario', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const [rows] = await db.query(`
      SELECT t.puntos_actuales FROM tarjetas_fidelidad t
      JOIN clientes c ON t.id_cliente = c.id_cliente
      WHERE c.id_cliente = ?
    `, [req.session.usuario.id_cliente]);

    const puntos_actuales = rows.length > 0 ? rows[0].puntos_actuales : 0;

    res.json({
      nome: req.session.usuario.nome,
      foto: req.session.usuario.foto,
      puntos: puntos_actuales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error obteniendo puntos' });
  }
});

  //Registo
  router.post('/register', async (req, res) => {
  const { username, nif, email, password, terms } = req.body;

  if (!terms) {
    return res.status(400).send('É necessário aceitar os termos de uso.');
  }

  try {
    const [existing] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?', 
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).send('Email já registado.');
    }

    // 1. Inserir novo usuário
    const [usuarioResult] = await db.query(`
      INSERT INTO usuarios (nombre, email, password_hash, id_rol, estado)
      VALUES (?, ?, ?, 5, 1)
    `, [username, email, password]);

    const id_usuario = usuarioResult.insertId;
    console.log("✅ Usuário inserido:", id_usuario);

    // Inserir cliente
const [clienteResult] = await db.query(`
  INSERT INTO clientes (id_usuario, direccion, telefono, fecha_registro)
  VALUES (?, NULL, NULL, NOW())
`, [id_usuario]);

const id_cliente = clienteResult.insertId; // ✅ nome correto

// Inserir tarjeta de fidelidade
await db.query(`
  INSERT INTO tarjetas_fidelidad (id_cliente, puntos_actuales)
  VALUES (?, 1000)
`, [id_cliente]); // ✅ usa id_cliente (não cliente_id!)


    res.redirect('/login.html');

  } catch (err) {
    console.error('❌ Erro ao registar cliente:', err.message);
    res.status(500).send('Erro ao criar conta.');
  }
});


module.exports = router;

