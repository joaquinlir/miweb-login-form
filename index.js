const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));

// Página de inicio
app.get("/", (req, res) => {
  res.send("<h1>Bienvenido a mi web</h1><p><a href='/formulario'>Ir al formulario</a></p>");
});

// Página del formulario
app.get("/formulario", (req, res) => {
  res.send(`
    <h1>Formulario de contacto</h1>
    <form action="/enviar" method="POST">
      <input type="text" name="nombre" placeholder="Tu nombre" required /><br/>
      <input type="email" name="correo" placeholder="Tu correo" required /><br/>
      <input type="tel" name="telefono" placeholder="Tu teléfono" /><br/>
      <select name="servicio" required>
        <option value="">Selecciona un servicio</option>
        <option value="consultoria">Consultoría</option>
        <option value="desarrollo">Desarrollo web</option>
        <option value="soporte">Soporte técnico</option>
      </select><br/>
      <textarea name="mensaje" placeholder="Escribe tu mensaje aquí..." rows="4" cols="40"></textarea><br/>
      <button type="submit">Enviar</button>
    </form>
  `);
});

// Envío y guardado
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
