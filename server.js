// =========================
// IMPORTS
// =========================
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

// =========================
// CONFIGURACIÓN APP
// =========================
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "public", "eventos.json");

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// =========================
// OBTENER EVENTOS
// =========================
app.get("/api/eventos", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]");
    }
    const data = fs.readFileSync(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error al leer eventos:", error);
    res.status(500).json({ error: "Error al leer eventos" });
  }
});

// =========================
// GUARDAR NUEVO EVENTO
// =========================
app.post("/api/eventos", (req, res) => {
  try {
    const evento = req.body;
    let eventos = [];

    if (fs.existsSync(DATA_FILE)) {
      eventos = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }

    // Generar ID único
    evento._id = new Date().getTime().toString();
    evento.estado = "pendiente";
    eventos.push(evento);

    fs.writeFileSync(DATA_FILE, JSON.stringify(eventos, null, 2));
    res.json({ ok: true, evento });
  } catch (error) {
    console.error("Error al guardar evento:", error);
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// =========================
// ACTUALIZAR ESTADO (ACEPTAR / RECHAZAR)
// =========================
app.put("/api/eventos/:id/estado", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(404).json({ error: "Archivo de datos no encontrado" });
    }

    let eventos = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const { id } = req.params;
    const { estado } = req.body;

    const index = eventos.findIndex(e => e._id === id || e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    eventos[index].estado = estado;
    fs.writeFileSync(DATA_FILE, JSON.stringify(eventos, null, 2));

    res.json({ ok: true, estado });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// =========================
// ELIMINAR EVENTO
// =========================
app.delete("/api/eventos/:id", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(404).json({ error: "Archivo de datos no encontrado" });
    }

    let eventos = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const { id } = req.params;

    eventos = eventos.filter(e => e._id !== id && e.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(eventos, null, 2));

    res.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});

