// routes/productos.js
const express = require('express');
const router = express.Router();
const db = require('../db_2'); // conexão MySQL

// GET /api/venda/:id — Dados de uma venda
router.get('/api/venda/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [venda] = await db.query(`
       SELECT v.*, u_cliente.nombre AS cliente_nome, u_operador.nombre AS operador_nome
  FROM ventas v
  JOIN clientes c ON v.id_cliente = c.id_cliente
  JOIN usuarios u_cliente ON c.id_usuario = u_cliente.id_usuario
  JOIN usuarios u_operador ON v.id_operador = u_operador.id_usuario
  WHERE v.id_venta = ?
    `, [id]);

    const [produtos] = await db.query(`
      SELECT * FROM ventas_productos WHERE id_venta = ?
    `, [id]);

    if (venda.length === 0) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    res.json({
      venda: venda[0],
      produtos: produtos
    });
  } catch (err) {
    console.error('Erro ao buscar detalhes da venda:', err);
    res.status(500).json({ message: 'Erro ao buscar venda' });
  }
});


// POST /api/venda
router.post('/api/venda', async (req, res) => {
  const { cliente, produtos } = req.body;
  const id_cliente = cliente.id_cliente;
  const id_operador = req.session.usuarioAdmin?.id_usuario || 1; // ou qualquer operador fixo
  const fecha_venta = new Date();


  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
total = produtos.reduce((acc, p) => acc + p.subtotal, 0);
const pontosTotais = produtos.reduce((acc, p) => acc + (p.puntos_por_unidad || 0) * p.quantidade, 0);
console.log('Pontos totais a serem somados:', pontosTotais);  // Verifica se os pontos estão sendo calculados corretamente


// Usa os valores enviados diretamente do frontend
const valorPagoTotal = parseFloat(req.body.valor_pago || 0);
const trocoTotal = parseFloat(req.body.troco || 0);





    // 1. Inserir na tabela 'ventas'
    const [ventaRes] = await conn.query(`
  INSERT INTO ventas (id_operador, id_cliente, fecha_venta, total, puntos_acumulados, valor_pago, troco)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`, [id_operador, id_cliente, fecha_venta, total, pontosTotais, valorPagoTotal, trocoTotal]);


    const id_venta = ventaRes.insertId;

    // 2. Inserir cada produto na 'ventas_productos' e atualizar stock
    for (const item of produtos) {
      const { id_producto, quantidade, nombre_producto, precio, puntos_por_unidad } = item;
      const subtotal = quantidade * precio;

      await conn.query(`
        INSERT INTO ventas_productos (id_venta, id_producto, nombre_producto, cantidad, precio_unitario, subtotal, puntos_otorgados)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [id_venta, id_producto, nombre_producto, quantidade, precio, subtotal, (puntos_por_unidad || 0) * quantidade]);

      await conn.query(`
        UPDATE productos SET stock_actual = stock_actual - ? WHERE id_producto = ?
      `, [quantidade, id_producto]);
    }

    // 3. Atualizar pontos na tarjeta de fidelidade
await conn.query(`
  UPDATE tarjetas_fidelidad SET puntos_actuales = puntos_actuales + ?
  WHERE id_cliente = ?
`, [pontosTotais, id_cliente]);

console.log(`Pontos atualizados para o cliente ${id_cliente}: ${pontosTotais}`);


    await conn.commit();
    conn.release();

    res.status(201).json({ id_venta });

  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error('Erro ao finalizar venda:', error);
    res.status(500).json({ message: 'Erro ao finalizar venda' });
  }
});
module.exports = router;