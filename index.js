// =========================
// IMPORTS
// =========================
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const ExcelJS = require("exceljs");

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
// EXPORTAR EVENTOS A EXCEL
// =========================
app.get("/api/eventos/excel", async (req, res) => {
  try {
    const eventos = await Evento.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Eventos");

    worksheet.columns = [
      { header: "Título", key: "tituloPrincipal", width: 25 },
      { header: "Detalle", key: "tituloDetalle", width: 40 },

      // 🔹 NUEVAS COLUMNAS SEPARADAS
      { header: "Fecha Inicio", key: "fechaInicio", width: 15 },
      { header: "Hora Inicio", key: "horaInicio", width: 12 },
      { header: "Fecha Fin", key: "fechaFin", width: 15 },
      { header: "Hora Fin", key: "horaFin", width: 12 },

      { header: "Meta", key: "meta", width: 20 },
      { header: "Participantes", key: "participantes", width: 15 },
      { header: "Población", key: "poblacion", width: 20 },
      { header: "Ubicación", key: "ubicacion", width: 25 },
      { header: "Responsable", key: "responsable", width: 20 },
      { header: "Estado", key: "estado", width: 15 },
      { header: "Alcalde", key: "requiereAlcalde", width: 12 },
      { header: "Prensa", key: "requierePrensa", width: 12 }
    ];

    eventos.forEach(evento => {

      // 🔹 Dividir el título
      let tituloPrincipal = "";
      let tituloDetalle = "";

      if (evento.title && evento.title.includes("-")) {
        const partes = evento.title.split("-");
        tituloPrincipal = partes[0].trim();
        tituloDetalle = partes.slice(1).join("-").trim();
      } else {
        tituloPrincipal = evento.title;
        tituloDetalle = "";
      }

      // 🔹 Separar fecha y hora inicio
      let fechaInicio = "";
      let horaInicio = "";
      let fechaFin = "";
      let horaFin = "";

      if (evento.start) {
        const partesInicio = evento.start.split("T");
        fechaInicio = partesInicio[0];
        horaInicio = partesInicio[1] ? partesInicio[1].substring(0,5) : "";
      }

      if (evento.end) {
        const partesFin = evento.end.split("T");
        fechaFin = partesFin[0];
        horaFin = partesFin[1] ? partesFin[1].substring(0,5) : "";
      }

      worksheet.addRow({
        tituloPrincipal,
        tituloDetalle,
        fechaInicio,
        horaInicio,
        fechaFin,
        horaFin,
        meta: evento.meta,
        participantes: evento.participantes,
        poblacion: evento.poblacion,
        ubicacion: evento.ubicacion,
        responsable: evento.responsable,
        estado: evento.estado,
        requiereAlcalde: evento.requiereAlcalde,
        requierePrensa: evento.requierePrensa
      });

    });

    // Encabezados en negrilla
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=eventos.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("❌ Error al generar Excel:", error);
    res.status(500).json({ error: "Error al generar Excel" });
  }
});

// =========================
// INICIAR SERVIDOR
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
