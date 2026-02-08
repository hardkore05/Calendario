// =========================
// IMPORTS
// =========================
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

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
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// =========================
// MODELO EVENTO
// =========================
const eventoSchema = new mongoose.Schema({
  title: String,
  start: String,
  end: String,
  meta: String,
  participantes: String,
  poblacion: String,
  ubicacion: String,
  requerimientos: String,
  responsable: String,
  creadoPor: String,
  fechaRegistro: String,
  estado: { type: String, default: "Pendiente" },

  // 🔴 CAMPOS QUE FALTABAN
  requiereAlcalde: { type: String, default: "NO" },
  requierePrensa: { type: String, default: "NO" }
});

const Evento = mongoose.model("Evento", eventoSchema, "eventos");

// =========================
// RUTA PRINCIPAL
// =========================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =========================
// API DE EVENTOS
// =========================

// 🔹 Obtener todos los eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    console.error("❌ Error al obtener eventos:", err);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
});

// 🔹 Guardar nuevo evento
app.post("/api/eventos", async (req, res) => {
  try {
    const nuevoEvento = new Evento({
      ...req.body,
      requiereAlcalde: req.body.requiereAlcalde || "NO",
      requierePrensa: req.body.requierePrensa || "NO"
    });

    await nuevoEvento.save();
    res.status(201).json(nuevoEvento);
  } catch (err) {
    console.error("❌ Error al guardar evento:", err);
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// 🔹 Cambiar estado del evento (aceptar/rechazar)
app.put("/api/eventos/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await Evento.findByIdAndUpdate(id, { estado });
    res.json({ message: `Estado actualizado a ${estado}` });
  } catch (err) {
    console.error("❌ Error al actualizar estado:", err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

// 🔹 Eliminar evento
app.delete("/api/eventos/:id", async (req, res) => {
  try {
    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: "Evento eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar evento:", err);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
