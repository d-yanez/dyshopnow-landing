// src/app.js
const express               = require('express');
const path                  = require('path');
const compression           = require('compression');
const nocache               = require('nocache');
const homeRouter            = require('./routes/home');
const categoryRouter        = require('./routes/category');

const app  = express();
const PORT = process.env.PORT || 3000;

// 1. Todas las respuestas dinámicas: No cache + Gzip
app.use(nocache());
app.use(compression());

// 2. Servir assets estáticos (css, js, imágenes)
app.use(
  express.static(
    path.join(__dirname, '../public'),
    {
      maxAge: '30d',        // Cache-Control
      immutable: true       // assets versionados
    }
  )
);

// 3. Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 4. Rutas dinámicas
app.use('/', homeRouter);
app.use('/', categoryRouter);

// 5. 404 genérico
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
