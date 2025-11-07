const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal: sirve el index.html desde la raíz del proyecto
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Manejar rutas no encontradas (opcional, evita errores 404 en SPA)
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

