// scripts/generate-full-llms.js
const fs = require('fs');
const path = require('path');
const categories = require('../data/categories.json');

const LINES = [];

// home
LINES.push('/');

categories.forEach(cat => {
  LINES.push(`/${cat.slug}`);
  cat.products.forEach(prod => {
    // extrae la parte tras el dominio
    const p = new URL(prod.url).pathname;
    LINES.push(p);
  });
});

fs.writeFileSync(
  path.join(__dirname, '../public/full-llms.txt'),
  LINES.join('\n'),
  'utf8'
);

console.log(`✅ full-llms.txt generado con ${LINES.length} rutas.`);