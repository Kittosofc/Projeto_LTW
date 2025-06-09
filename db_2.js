const mysql = require('mysql2/promise'); // usa o modo "promise" desde início

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sgpc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ Pool de conexões criado com sucesso');

module.exports = pool;
