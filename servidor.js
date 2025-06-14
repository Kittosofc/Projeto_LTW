const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para interpretar datos de formularios (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware para interpretar JSON si fuera necesario
app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: 'minha_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true se usares HTTPS
    httpOnly: true
  }
}));

// Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas importadas
//iniciar sesión
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
// ver historial de puntos
const historialPontosRoutes = require('./routes/historialPuntos.js');
app.use('/api/historial-pontos', historialPontosRoutes);

//resgatar puntos
const resgatarPontosRoutes = require('./routes/resgatarPontos.js');
app.use('/api/resgatar-pontos', resgatarPontosRoutes);

const historialResgatesRoutes = require('./routes/historialResgates.js');
app.use('/api/historial-resgates', historialResgatesRoutes);


const auth_admRoutes = require('./routes/auth_admin');
app.use('/admin', auth_admRoutes);
const auth_admRoutes2 = require('./routes/auth_admin2');
app.use('/', auth_admRoutes2);

const usuariosRoutes = require('./routes/usuarios');
app.use('/', usuariosRoutes);

const clientesRoutes = require('./routes/clientes');
app.use('/',clientesRoutes); // esto importa las rutas /api/clientes
const rolesRoutes = require('./routes/roles');
app.use('/',rolesRoutes); // esto importa las rutas /api/clientes

const ventasRoutes = require('./routes/ventas');
app.use('/',ventasRoutes); // esto importa las rutas /api/ventas


const productosRoutes = require('./routes/productos');
app.use('/',productosRoutes);

const editarCliente = require('./routes/editarcliente.js');

// Usando a rota /cliente para as requisições de edição
app.use('/cliente', editarCliente);


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
