// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

// 1) Carga tu JSON de categorías
const categories = require(path.join(__dirname, '../data/categories.json'));

// 2) Define tu dominio base (ajústalo si cambia)
const DOMAIN = 'https://landing.dyshopnow.cl';

// 3) Construye array de URLs
const urls = [];

// Home
urls.push({ loc: `${DOMAIN}/`, priority: '1.0' });

// Por cada categoría…
categories.forEach(cat => {
  // url de categoría
  urls.push({
    loc: `${DOMAIN}/${cat.slug}`,
    priority: '0.8'
  });

  // por cada producto en esa categoría…
  if (Array.isArray(cat.products)) {
    cat.products.forEach(prod => {
      // extrae la parte “/product/…” de la URL original
      const relativePath = new URL(prod.url).pathname;
      urls.push({
        loc: `${DOMAIN}${relativePath}`,
        priority: '0.6'
      });
    });
  }
});

// 4) Genera el XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

urls.forEach(u => {
  xml += '  <url>\n';
  xml += `    <loc>${u.loc}</loc>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>';

// 5) Escribe el fichero en public/sitemap.xml
const outPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');

console.log(`✅ sitemap.xml generado con ${urls.length} URLs en ${outPath}`);