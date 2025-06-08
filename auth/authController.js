const db = require('../db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT u.*, c.id_cliente, t.puntos_actuales, r.nombre_rol AS tipo
    FROM usuarios u
    LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
    LEFT JOIN tarjetas_fidelidad t ON c.id_cliente = t.id_cliente
    LEFT JOIN roles r ON u.id_rol = r.id_rol
    WHERE u.email = ?
    LIMIT 1
  `;

  try {
    const [results] = await db.query(sql, [email]);

    // Verifica se o utilizador existe
    if (!results || results.length === 0) {
      return res.status(401).send('Credenciais inválidas');
    }

    const usuario = results[0];

    // Verifica a password usando bcrypt
    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      return res.status(401).send('Credenciais inválidas');
    }

    // Verifica se a conta está ativa
    if (usuario.estado !== 1) {
      return res.status(403).send('A sua conta está desativada ou inativa.');
    }

    // Armazena os dados do utilizador na sessão
    req.session.usuario = {
  id_usuario: usuario.id_usuario,
  nome: usuario.nombre,
  tipo: usuario.tipo,
  id_cliente: usuario.id_cliente, // ← obrigatório estar presente
  foto: usuario.foto || 'default.jpg'
};


    // Resposta com dados essenciais
    return res.json({
      id_usuario: usuario.id_usuario,
      id_cliente: usuario.id_cliente,
      nome: usuario.nombre,
      tipo: usuario.tipo,
      foto: usuario.foto || 'default.jpg',
      pontos: usuario.puntos_actuales || 0
    });

  } catch (err) {
    console.error('Erro na consulta SQL:', err);
    return res.status(500).send('Erro no servidor');
  }
};
