const express = require("express");
const cors = require("cors");
const pool = require("./conexionDB"); // tu conexión a PostgreSQL

const app = express();
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// ---------- Rutas ----------

// Registro de usuario
app.post("/clientes/registrar", async (req, res) => {
  const { nombre, email, telefono } = req.body;
  try {
    const existe = await pool.query("SELECT 1 FROM clientes WHERE email=$1", [email]);
    if (existe.rows.length > 0) return res.json({ success: false, message: "Email ya registrado" });

    await pool.query(
      "INSERT INTO clientes (nombre, email, telefono) VALUES ($1,$2,$3)",
      [nombre, email, telefono]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Login de usuario
app.post("/clientes/login", async (req, res) => {
  const { email, telefono } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM clientes WHERE email=$1 AND telefono=$2",
      [email, telefono]
    );
    if (result.rows.length === 0) return res.json({ success: false });
    res.json({ success: true, userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Registrar un nuevo pedido
app.post("/ordenes/registrar", async (req, res) => {
  const { cliente, patillo_nombre, note, estado } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ordenes (cliente, patillo_nombre, note, estado) VALUES ($1, $2, $3, $4) RETURNING *",
      [cliente, patillo_nombre, note, estado || 'pending']
    );
    res.json({ success: true, orden: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Listar pedidos de un cliente
app.get("/ordenes/:clienteId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ordenes WHERE cliente=$1 ORDER BY creado DESC",
      [req.params.clienteId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado de un pedido
app.put("/ordenes/:id/estado", async (req, res) => {
  try {
    const pedido = await pool.query("SELECT * FROM ordenes WHERE id=$1", [req.params.id]);
    if (pedido.rows.length === 0) return res.status(404).json({ error: "Pedido no encontrado" });

    let nextEstado = "pending";
    if (pedido.rows[0].estado === "pending") nextEstado = "preparanding";
    else if (pedido.rows[0].estado === "preparanding") nextEstado = "delivered";

    const result = await pool.query(
      "UPDATE ordenes SET estado=$1 WHERE id=$2 RETURNING *",
      [nextEstado, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
