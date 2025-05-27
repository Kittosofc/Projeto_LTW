const express = require('express');
const router = express.Router();
const authController = require('../auth/authController.js');

router.post('/login', authController.login);


router.get('/api/usuario', (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'No autenticado' });
  } 
  res.json({
    nome: req.session.usuario.nome,
    foto: req.session.usuario.foto,
    pontos: req.session.usuario.puntos_actuales
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error cerrando sesión');
    }
    res.clearCookie('connect.sid'); // Borra cookie de sesión (opcional pero recomendado)
    res.sendStatus(200);
  });
});
  

module.exports = router;
