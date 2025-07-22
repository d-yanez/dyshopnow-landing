const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ruta dinámica para cada categoría
router.get('/:slug', (req, res) => {
  const slug = req.params.slug;

  // Cargar el JSON
  const dataPath = path.join(__dirname, '../../data/categories.json');
  const categories = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Buscar categoría por slug
  const category = categories.find(cat => cat.slug === slug);

  if (!category) {
    return res.status(404).send('Categoría no encontrada');
  }

  // Renderizamos con los valores necesarios para Open Graph / Twitter
  res.render('category', {
    seo: {
      title: `${category.name} | Dyshopnow`,
      description: category.description
    },
    category,
    // para construir og:url y twitter:url
    request: req,
    // para og:type / twitter:card
    pageType: 'website',
    // para og:image / twitter:image
    ogImage: category.banner
  });
});

module.exports = router;