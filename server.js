// =========================
// IMPORTS
// =========================
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// =========================
// CONFIGURACIÓN APP
// =========================
const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// CONEXIÓN A MONGODB LOCAL
// =========================
const MONGO_URI = "mongodb://localhost:27017/calendario";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB local"))
  .catch(err => console.error("❌ Error conectando a MongoDB:", err));

// =========================
// MODELO EVENTO
// =========================
const EventoSchema = new mongoose.Schema({
  title: String,
  start: String,
  end: String,
  meta: String,
  participantes: String,
  poblacion: String,
  ubicacion: String,
  requerimientos: String,
  oficina: String,
  responsable: String,
  creadoPor: String,
  fechaRegistro: String,
  estado: { type: String, default: "Pendiente" }
  requiereAlcalde: { type: String, default: "NO" },
  requierePrensa: { type: String, default: "NO" },
});

const Evento = mongoose.model("Evento", EventoSchema);

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// =========================
// RUTAS API
// =========================

// 🔹 Obtener todos los eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

// 🔹 Crear nuevo evento
app.post("/api/eventos", async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.json({ ok: true, evento: nuevoEvento });
  } catch (error) {
    console.error("Error al guardar evento:", error);
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// 🔹 Actualizar estado (Aceptar/Rechazar)
app.put("/api/eventos/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const evento = await Evento.findByIdAndUpdate(id, { estado }, { new: true });
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    res.json({ ok: true, estado });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// 🔹 Eliminar evento
app.delete("/api/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Evento.findByIdAndDelete(id);
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
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
