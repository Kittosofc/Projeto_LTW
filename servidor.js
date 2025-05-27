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
  secret: 'palavra_secreta', // Cambia esto por algo secreto
  resave: false,
  saveUninitialized: false,
  cookie: { } // Duración de la sesión (ej: 10 minutos)
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


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
