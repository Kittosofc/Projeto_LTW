const express = require('express');
const router = express.Router();
const db = require('../db');

// Rota para editar os dados do cliente
router.put('/api/usuario', async (req, res) => {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { direcao, telefone } = req.body;

  try {
    const { id_cliente } = req.session.usuario;

    // Atualizar os dados do cliente
    await db.query(`
      UPDATE clientes
      SET direccion = ?, telefono = ?
      WHERE id_cliente = ?
    `, [direcao || null, telefone || null, id_cliente]);

    res.status(200).json({ message: 'Dados atualizados com sucesso.' });
  } catch (err) {
    console.error('❌ Erro ao editar cliente:', err.message);
    res.status(500).json({ error: 'Erro ao atualizar dados do cliente.' });
  }
});

module.exports = router;
