const express = require('express');
const router = express.Router();
const authController = require('../auth/authController.js');
const db = require('../db');
const bcrypt = require('bcrypt');

// Rota de login
router.post('/login', authController.login);

// Rota para obter dados do utilizador autenticado (ex: pontos)
router.get('/api/usuario', async (req, res) => {
  if (!req.session.usuario || !req.session.usuario.id_cliente) {
    return res.status(401).json({ error: 'Não autenticado ou cliente inválido' });
  }

  try {
    const [rows] = await db.query(`
      SELECT t.puntos_actuales FROM tarjetas_fidelidad t
      JOIN clientes c ON t.id_cliente = c.id_cliente
      WHERE c.id_cliente = ?
    `, [req.session.usuario.id_cliente]);

    const pontos = rows.length > 0 ? rows[0].puntos_actuales : 0;

    res.json({
      nome: req.session.usuario.nome,
      foto: req.session.usuario.foto,
      pontos // ← aqui envia o nome certo
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter pontos' });
  }
});


// Rota de registo
router.post('/register', async (req, res) => {
  const { username, nif, email, password, terms } = req.body;

  if (!terms) {
    return res.status(400).send('É necessário aceitar os termos de uso.');
  }

  try {
    // Verifica se o e-mail já está registado
    const [existing] = await db.query(
      'SELECT id_usuario FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).send('Email já registado.');
    }

    // Gera o hash da password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Inserir novo utilizador
    const [usuarioResult] = await db.query(`
      INSERT INTO usuarios (nombre, email, password_hash, id_rol, estado)
      VALUES (?, ?, ?, 5, 1)
    `, [username, email, passwordHash]);

    const id_usuario = usuarioResult.insertId;
    console.log("✅ Usuário inserido:", id_usuario);

    // Inserir cliente
    const [clienteResult] = await db.query(`
      INSERT INTO clientes (id_usuario, direccion, telefono, fecha_registro)
      VALUES (?, NULL, NULL, NOW())
    `, [id_usuario]);

    const id_cliente = clienteResult.insertId;

    // Inserir cartão de fidelidade
    await db.query(`
      INSERT INTO tarjetas_fidelidad (id_cliente, puntos_actuales)
      VALUES (?, 1000)
    `, [id_cliente]);

    // Redireciona para login
    res.redirect('/login.html');

  } catch (err) {
    console.error('❌ Erro ao registar cliente:', err.message);
    res.status(500).send('Erro ao criar conta.');
  }
});

// Rota de logout (opcional)
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao terminar sessão:', err);
      return res.status(500).send('Erro ao fazer logout');
    }
    res.clearCookie('connect.sid');
    res.sendStatus(200);
  });
});

module.exports = router;
