const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      // o el IP si está en otro servidor
  user: 'root',     // ejemplo: 'root'
  password: '', // tu contraseña de MySQL
  database: 'sgpc'      // tu base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos dexamp');
  
});

module.exports = connection;
