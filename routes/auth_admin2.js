  const express = require('express');
  const router = express.Router();
  const db = require('../db'); // tu conexión a BD


  router.get('/api/usuario-adm', (req, res) => {
    const usuario = req.session.usuarioAdmin;

    if (!usuario) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    res.json({
      nome: usuario.nombre,
      foto: usuario.foto,
      rol: usuario.rol, // <- aqui está o nome do cargo corretamente
    });
  });


  module.exports = router;
