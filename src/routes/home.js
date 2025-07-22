const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta principal (home)
router.get('/', (req, res) => {
  // Cargar el JSON de categorías
  const dataPath = path.join(__dirname, '../../data/categories.json');
  const categories = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Renderizamos con las mismas variables OG/Twitter
  res.render('home', {
    seo: {
      title: 'Dyshopnow – Figuras y coleccionables exclusivos',
      description: 'Descubre y compra figuras, peluches y coleccionables oficiales en Dyshopnow. Envíos rápidos a todo Chile.'
    },
    categories,
    request: req,
    pageType: 'website',
    // aquí podrías usar un banner genérico del home
    ogImage: '/default-og.jpg'
  });
});

module.exports = router;