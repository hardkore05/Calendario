// ============================
// index.js — versión con MongoDB Atlas
// ============================
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// 🔌 Conexión a MongoDB Atlas
// ============================
mongoose.connect("mongodb+srv://Daniel:Daniel2025@cluster0.h9b1yko.mongodb.net/calendario?retryWrites=true&w=majority")
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error al conectar MongoDB:", err));

// ============================
// 📘 Definir modelo
// ============================
const eventoSchema = new mongoose.Schema({
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
}, { collection: "eventos" });

const Evento = mongoose.model("Evento", eventoSchema);

// ============================
// ⚙️ Middleware
// ============================
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ============================
// 🌐 Ruta principal
// ============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ============================
// 🧠 API de eventos
// ============================

// Obtener todos los eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
});

// Guardar nuevo evento
app.post("/api/eventos", async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    await nuevoEvento.save();
    console.log("✅ Evento guardado:", nuevoEvento.title);
    res.json({ message: "Evento guardado correctamente" });
  } catch (err) {
    console.error("❌ Error al guardar evento:", err);
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// ============================
// 🚀 Iniciar servidor
// ============================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
