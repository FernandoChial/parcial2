const { Pool } = require("pg");
require("dotenv").config(); // carga las variables de .env


// Configuración conexión PostgreSQL usando variables .env
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;