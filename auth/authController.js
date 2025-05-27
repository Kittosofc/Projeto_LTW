const db = require('../db');
exports.login = (req, res) => {
  const { username, password } = req.body;

const sql = `
  SELECT u.*, c.id_cliente, t.puntos_actuales, r.nombre_rol AS tipo
  FROM usuarios u
  LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
  LEFT JOIN tarjetas_fidelidad t ON c.id_cliente = t.id_cliente
  LEFT JOIN roles r ON u.id_rol = r.id_rol
  WHERE u.email = ? AND u.password_hash = ?
  LIMIT 1
`;


  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error en consulta SQL:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (!results || results.length === 0) {
      return res.status(401).send('Credenciales inválidas');
    }

    const usuario = results[0];

    req.session.usuario = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nombre,
      tipo: usuario.tipo,
      id_cliente: usuario.id_cliente || null,
      puntos_actuales: usuario.puntos_actuales || 0,
      foto: usuario.foto || 'default.jpg' // Usar una imagen por defecto si no hay foto

      
    };
    return res.redirect('/dashboard.html');
  });
};
