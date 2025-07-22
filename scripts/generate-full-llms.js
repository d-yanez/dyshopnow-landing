// scripts/generate-full-llms.js
const fs = require('fs');
const path = require('path');
const categories = require('../data/categories.json');

const LINES = [];

// Home
LINES.push('/');

// Categorías bajo /category/:slug
categories.forEach(cat => {
  LINES.push(`/category/${cat.slug}`);

  // Productos (mantiene la ruta original /product/…)
  cat.products.forEach(prod => {
    const p = new URL(prod.url).pathname;
    LINES.push(p);
  });
});

// Escribe full-llms.txt
const outPath = path.join(__dirname, '../public/full-llms.txt');
fs.writeFileSync(outPath, LINES.join('\n'), 'utf8');

console.log(`✅ full-llms.txt generado con ${LINES.length} rutas en ${outPath}`);