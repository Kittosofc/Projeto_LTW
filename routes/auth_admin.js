const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a BD



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = `
      SELECT u.*, r.nombre_rol
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.email = ? AND u.password_hash = ? AND u.estado = 1
      LIMIT 1
    `;

    const [results] = await db.query(sql, [email, password]);

    if (!results || results.length === 0) {
      return res.status(401).send('Credenciais inválidas');
    }

    const usuario = results[0];

    // Guardar dados em sessão
    req.session.usuarioAdmin = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.nombre_rol,
      id_rol: usuario.id_rol,
      foto: usuario.foto || 'default.jpg'
    };

    // Redirecionar com base no id_rol
    if (usuario.id_rol === 1) {
      return res.redirect('/home_adm.html');
    } else if (usuario.id_rol === 3) {
      return res.redirect('/home.html');
    } else {
      return res.status(403).send('Acesso não permitido para este tipo de utilizador');
    }

  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro no servidor');
  }
});



module.exports = router;
