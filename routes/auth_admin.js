const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a BD



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consulta para validar usuario admin
    const sql = `
      SELECT u.*, r.nombre_rol AS tipo
      FROM usuarios u
      JOIN roles r ON u.id_rol = r.id_rol
      WHERE u.email = ? AND u.password_hash = ? AND r.nombre_rol = 'Administrador' AND u.estado = 1
      LIMIT 1
    `;

    const [results] = await db.query(sql, [email, password]);

    if (!results || results.length === 0) {
      // Usuario no encontrado o no es admin o contraseña incorrecta
      return res.status(401).send('Credenciales inválidas o no es administrador');
    }

    const usuario = results[0];

    // Guardar datos en sesión
    req.session.usuarioAdmin = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.nombre_rol,
      foto: usuario.foto || 'default.jpg'
    };

    // Redirigir a la página de administración
    return res.redirect('/home_adm.html');

  } catch (err) {
    console.error(err);
    return res.status(500).send('Error en el servidor');
  }
});



module.exports = router;
