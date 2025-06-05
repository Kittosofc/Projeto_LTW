const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { cliente_id, id_producto_canje } = req.body;

    // 1) Obtener datos del cliente (nombre) desde Usuarios + Clientes
    const [clienteRows] = await db.query(`
      SELECT u.nombre, tf.puntos_actuales
      FROM Clientes c
      JOIN Usuarios u ON c.id_usuario = u.id_usuario
      JOIN Tarjetas_Fidelidad tf ON c.id_cliente = tf.id_cliente
      WHERE c.id_cliente = ?
    `, [cliente_id]);

    if (clienteRows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    const cliente = clienteRows[0];

    // 2) Obtener info del producto a canjear
    const [productoRows] = await db.query(`
      SELECT nombre_producto, puntos_necesarios
      FROM Productos_Canje
      WHERE id_producto_canje = ?
    `, [id_producto_canje]);

    if (productoRows.length === 0) {
      return res.status(404).json({ error: 'Producto de canje no encontrado' });
    }
    const producto = productoRows[0];

    // 3) Verificar que el cliente tenga puntos suficientes
    if (cliente.puntos_actuales < producto.puntos_necesarios) {
      return res.status(400).json({ error: 'Pontos insuficientes para resgatar este produto.' });
    }

    // 4) Descontar puntos y guardar canje
    await db.query(`
  UPDATE Tarjetas_Fidelidad
  SET puntos_actuales = puntos_actuales - ?
  WHERE id_cliente = ?
`, [producto.puntos_necesarios, cliente_id]);

    // 5) Insertar registro de canje en Canjes_Puntos
    await db.query(`
      INSERT INTO Canjes_Puntos (id_cliente, id_producto_canje, puntos_utilizados)
      VALUES (?, ?, ?)
    `, [cliente_id, id_producto_canje, producto.puntos_necesarios]);

    // 6) Responder con la info del canje y puntos restantes
    const [updatedPuntosRows] = await db.query(`
  SELECT puntos_actuales FROM Tarjetas_Fidelidad
  WHERE id_cliente = ?
`, [cliente_id]);
console.log('updatedPuntosRows:', updatedPuntosRows);

const puntosRestantes = updatedPuntosRows[0]?.puntos_actuales;  // <-- aquí usa ? para evitar error

    return res.json({
      mensaje: 'Canje realizado con éxito',
      cliente: {
        id_cliente: cliente_id,
        nombre: cliente.nombre,
      },
      tarjeta: {
    puntos_antes: cliente.puntos_actuales,
    puntos_restantes: puntosRestantes
  },
      producto: {
        id_producto_canje,
        nombre_producto: producto.nombre_producto,
        puntos_necesarios: producto.puntos_necesarios
      }
    });
  } catch (error) {
    console.error('Error en /resgatar-pontos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ✅ Nueva ruta GET para obtener producto por ID
router.get('/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [productoRows] = await db.query(`
      SELECT * FROM Productos_Canje
      WHERE id_producto_canje = ?
    `, [id]);

    if (productoRows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(productoRows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Obtener todos los productos
router.get('/api/productos', async (req, res) => {
  try {
    const [productos] = await db.query(`
      SELECT id_producto_canje, nombre_producto, descripcion, puntos_necesarios, foto_producto   
      FROM Productos_Canje
    `);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;