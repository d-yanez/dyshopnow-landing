// scripts/generate-sitemap.js
// Powerful sitemap generator for landing.dyshopnow.cl
// - Generates sitemap-landing.xml (categories + product pages)
// - Adds image:image entries for product and banner images
// - Creates sitemap-index.xml pointing to sitemap-landing.xml
// - Optionally writes sitemap-shop.xml with external buyUrl links (for www.dyshopnow.cl)
//   NOTE: That file must be hosted under the www domain to be valid for Search Console.

const fs = require('fs');
const path = require('path');

// ---- Config ----
const DOMAIN = 'https://landing.dyshopnow.cl'; // Landing domain for pages we want indexed
const NOW_ISO = new Date().toISOString();

// Load categories data
const categories = require(path.join(__dirname, '../data/categories.json'));

// Helpers
const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const ensureAbs = (url) => {
  if (!url) return null;
  try {
    // If it's already absolute, return as-is
    const u = new URL(url);
    return u.href;
  } catch (e) {
    // Make it absolute against DOMAIN
    return new URL(url, DOMAIN).href;
  }
};

const sameHostAsDomain = (url) => {
  try {
    const a = new URL(url);
    const b = new URL(DOMAIN);
    return a.hostname === b.hostname;
  } catch (_) {
    return false;
  }
};

function buildUrlset(urls, { withImages = false } = {}) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${withImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>\n`;

  urls.forEach(u => {
    xml += '  <url>\n';
    xml += `    <loc>${esc(u.loc)}</loc>\n`;
    if (u.lastmod) xml += `    <lastmod>${esc(u.lastmod)}</lastmod>\n`;
    if (u.changefreq) xml += `    <changefreq>${esc(u.changefreq)}</changefreq>\n`;
    if (u.priority) xml += `    <priority>${esc(u.priority)}</priority>\n`;

    if (withImages && Array.isArray(u.images)) {
      u.images.filter(Boolean).forEach(img => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${esc(img)}</image:loc>\n`;
        xml += '    </image:image>\n';
      });
    }

    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
}

function buildSitemapIndex(entries) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  entries.forEach(it => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${esc(it.loc)}</loc>\n`;
    xml += `    <lastmod>${esc(it.lastmod || NOW_ISO)}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });
  xml += '</sitemapindex>';
  return xml;
}

// ---- Collect landing URLs ----
const landingUrls = [];

// Home
landingUrls.push({
  loc: `${DOMAIN}/`,
  priority: '1.0',
  changefreq: 'daily',
  lastmod: NOW_ISO,
  images: []
});

// Categories + products
(categories || []).forEach(cat => {
  const catLoc = `${DOMAIN}/category/${cat.slug}`;
  const catImages = [];
  if (cat.banner) catImages.push(ensureAbs(cat.banner));

  landingUrls.push({
    loc: catLoc,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: NOW_ISO,
    images: catImages
  });

  if (Array.isArray(cat.products)) {
    cat.products.forEach(prod => {
      const prodLoc = ensureAbs(prod.url);
      if (!prodLoc || !sameHostAsDomain(prodLoc)) return; // keep only landing pages here

      const imgs = [];
      if (prod.image) imgs.push(ensureAbs(prod.image));
      if (Array.isArray(prod.images)) {
        prod.images.forEach(i => imgs.push(ensureAbs(i)));
      }

      landingUrls.push({
        loc: prodLoc,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: NOW_ISO,
        images: imgs
      });
    });
  }
});

// Deduplicate by loc
const seen = new Set();
const dedupLanding = landingUrls.filter(u => {
  if (seen.has(u.loc)) return false;
  seen.add(u.loc);
  return true;
});

// ---- Optional: shop (buyUrl) sitemap (external domain) ----
const shopUrls = [];
(categories || []).forEach(cat => {
  (cat.products || []).forEach(prod => {
    if (!prod.buyUrl) return;
    const loc = ensureAbs(prod.buyUrl);
    if (!loc) return;
    shopUrls.push({
      loc,
      priority: '0.5',
      changefreq: 'weekly',
      lastmod: NOW_ISO
    });
  });
});

const dedupShop = Array.from(new Map(shopUrls.map(u => [u.loc, u])).values());

// ---- Write files ----
const outDir = path.join(__dirname, '../public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 1) Landing pages (with images)
const landingXml = buildUrlset(dedupLanding, { withImages: true });
fs.writeFileSync(path.join(outDir, 'sitemap-landing.xml'), landingXml, 'utf8');

// 2) Sitemap index (only landing by default)
const indexXml = buildSitemapIndex([
  { loc: `${DOMAIN}/sitemap-landing.xml`, lastmod: NOW_ISO },
]);
fs.writeFileSync(path.join(outDir, 'sitemap-index.xml'), indexXml, 'utf8');

// 3) Optional: shop sitemap written locally for convenience
if (dedupShop.length) {
  const shopXml = buildUrlset(dedupShop);
  fs.writeFileSync(path.join(outDir, 'sitemap-shop.xml'), shopXml, 'utf8');
}

console.log(`✅ sitemap-landing.xml generado con ${dedupLanding.length} URLs`);
console.log('✅ sitemap-index.xml generado (incluye sitemap-landing.xml)');
if (dedupShop.length) {
  console.log(`ℹ️ sitemap-shop.xml creado con ${dedupShop.length} URLs (subirlo al dominio de la tienda: www.dyshopnow.cl)`);
}