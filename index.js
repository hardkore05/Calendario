const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, "data", "eventos.json");

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// =========================
// RUTA PRINCIPAL
// =========================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// =========================
// API DE EVENTOS
// =========================

// Obtener todos los eventos
app.get("/api/eventos", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer los eventos" });
    res.json(JSON.parse(data));
  });
});

// Guardar nuevo evento
app.post("/api/eventos", (req, res) => {
  const nuevoEvento = req.body;
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error al leer archivo" });

    const eventos = JSON.parse(data);
    eventos.push(nuevoEvento);

    fs.writeFile(dataPath, JSON.stringify(eventos, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: "Error al guardar evento" });
      res.json({ message: "Evento guardado correctamente" });
    });
  });
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


