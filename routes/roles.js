const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión a BD



router.get('/api/roles', async (req, res) => {
  const [rows] = await db.query('SELECT id_rol, nombre_rol FROM Roles');
  res.json(rows);
});

router.get('/api/permissoes', async (req, res) => {
  const [rows] = await db.query('SELECT id_permiso, nombre_permiso FROM Permisos');
  res.json(rows);
});
router.get('/api/roles/:id/permissoes', async (req, res) => {
  const [rows] = await db.query(
    'SELECT id_permiso FROM Roles_Permisos WHERE id_rol = ?',
    [req.params.id]
  );
  res.json(rows.map(r => r.id_permiso));
});
router.post('/api/roles/:id/permissoes', async (req, res) => {
  const { permissoes } = req.body;
  const idRol = req.params.id;

  // Apagar permissões antigas
  await db.query('DELETE FROM Roles_Permisos WHERE id_rol = ?', [idRol]);

  // Inserir novas permissões
  if (Array.isArray(permissoes) && permissoes.length > 0) {
    const valores = permissoes.map(p => [idRol, p]);
    await db.query('INSERT INTO Roles_Permisos (id_rol, id_permiso) VALUES ?', [valores]);
  }

  res.json({ mensagem: 'Permissões atualizadas' });
});
module.exports = router;