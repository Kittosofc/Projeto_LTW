const db = require('../db');


exports.login = async (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT u.*, c.id_cliente, t.puntos_actuales, r.nombre_rol AS tipo
    FROM usuarios u
    LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
    LEFT JOIN tarjetas_fidelidad t ON c.id_cliente = t.id_cliente
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.email = ? AND u.password_hash = ?
    LIMIT 1
  `;

  try {
    const [results] = await db.query(sql, [email, password]);

    if (!results || results.length === 0) {
      return res.status(401).send('Credenciais inválidas');
    }

    const usuario = results[0];

    // Verificação do estado (1 = ativo)
    if (usuario.estado !== 1) {
      return res.status(403).send('A sua conta está desativada ou inativa.');
    }

    // Login válido
    req.session.usuario = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nombre,
      tipo: usuario.tipo,
      id_cliente: usuario.id_cliente || null,
      puntos_actuales: usuario.puntos_actuales || 0,
      foto: usuario.foto || 'default.jpg'
    };

    return res.redirect('/dashboard.html');
  } catch (err) {
    console.error('Erro na consulta SQL:', err);
    return res.status(500).send('Erro no servidor');
  }
};
