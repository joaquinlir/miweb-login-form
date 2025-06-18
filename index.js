const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Ruta HTML del formulario
app.get("/formulario", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "formulario.html"));
});

// Ruta de envío y guardado en datos.json
app.post("/enviar", (req, res) => {
  const { nombre, correo, telefono, servicio, mensaje } = req.body;
  const nuevoRegistro = {
    nombre,
    correo,
    telefono,
    servicio,
    mensaje,
    fecha: new Date().toISOString()
  };

  fs.readFile("datos.json", "utf8", (err, data) => {
    let registros = [];
    if (!err && data) {
      try {
        registros = JSON.parse(data);
      } catch (e) {
        console.error("Error al parsear datos:", e);
      }
    }

    registros.push(nuevoRegistro);

    fs.writeFile("datos.json", JSON.stringify(registros, null, 2), err => {
      if (err) {
        console.error("Error al guardar:", err);
        return res.status(500).send("Error guardando la información.");
      }

      res.send(`Gracias, ${nombre}. Tu información ha sido registrada.`);
    });
  });
});

// Página de inicio
app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a mi web</h1><p><a href='/formulario'>Ir al formulario</a></p>");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
