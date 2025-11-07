import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "eventos.json");

// Leer eventos
app.get("/api/eventos", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al leer los eventos" });
  }
});

// Guardar nuevo evento
app.post("/api/eventos", (req, res) => {
  try {
    const eventos = fs.existsSync(DATA_FILE)
      ? JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))
      : [];
    eventos.push(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(eventos, null, 2));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar evento" });
  }
});

// Actualizar estado (aceptar/rechazar)
app.put("/api/eventos/:id", (req, res) => {
  try {
    let eventos = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    const index = eventos.findIndex(e => e.id == req.params.id);
    if (index !== -1) {
      eventos[index] = { ...eventos[index], ...req.body };
      fs.writeFileSync(DATA_FILE, JSON.stringify(eventos, null, 2));
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: "Evento no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar evento" });
  }
});

// Puerto para Render (usa variable de entorno o 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
