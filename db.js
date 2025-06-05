const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',      // o el IP si está en otro servidor
  user: 'root',     // ejemplo: 'root'
  password: '', // tu contraseña de MySQL
  database: 'sgpc'      // tu base de datos
});

con.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos dexamp');
  
});

// Exportamos el objeto promisificado
module.exports = con.promise();
