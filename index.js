const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta absoluta hacia la carpeta "public"
const publicPath = path.join(__dirname, "src", "public");

// Servir la carpeta "public" como contenido estático
app.use(express.static(publicPath));

// Ruta principal: sirve el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

