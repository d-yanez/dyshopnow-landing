// src/routes/product.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Cargamos el JSON de categorías para buscar el producto por slug
const categories = require(path.join(__dirname, '../../data/categories.json'));
const policies = require(path.join(__dirname, '../../data/policies.json'));

router.get('/:slug', (req, res, next) => {
  const { slug } = req.params;

  // Buscamos en cada categoría
  let producto = null;
  categories.forEach(cat => {
    const p = cat.products.find(pr => {
      // comparamos solo la parte final de la URL contra :slug
      const pathName = new URL(pr.url).pathname.split('/').pop();
      return pathName === slug;
    });
    if (p) {
      producto = { ...p, category: cat.name };
    }
  });

  if (!producto) {
    return next(); // cae al 404 de app.js
  }

  // Datos SEO opcionales
  const seo = {
    title: producto.seo?.title || producto.name,
    description: producto.seo?.description || producto.description
  };

  // Renderizamos product.ejs
  res.render('product', {
    product: {
      ...producto,
      seo,
      brand: producto.brand || producto.category,
      policies: policies
    },
    request: req,
    ogImage: producto.image.replace(/\.(jpe?g|png)$/, '.webp')
  });
});

module.exports = router;