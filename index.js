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
// MIDDLEWARE
// =========================
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// =========================
// CONEXIÓN A MONGODB ATLAS
// =========================
mongoose.connect("mongodb+srv://Daniel:Daniel2025@cluster0.h9b1yko.mongodb.net/calendario?retryWrites=true&w=majority")
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
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
});

const Evento = mongoose.model("Evento", EventoSchema, "eventos");

// =========================
// RUTAS API
// =========================

// 🔹 Obtener todos los eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

// 🔹 Crear nuevo evento
app.post("/api/eventos", async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    res.status(201).json({ ok: true, evento: nuevoEvento });
  } catch (error) {
    console.error("❌ Error al guardar evento:", error);
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// 🔹 Actualizar estado (Aceptar / Rechazar)
app.put("/api/eventos/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const evento = await Evento.findByIdAndUpdate(id, { estado }, { new: true });
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.json({ ok: true, estado });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// 🔹 Eliminar evento
app.delete("/api/eventos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Evento.findByIdAndDelete(id);
    res.json({ ok: true, message: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

// =========================
// SERVIR FRONTEND
// =========================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
