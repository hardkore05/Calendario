const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));



