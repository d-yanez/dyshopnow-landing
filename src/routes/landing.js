// src/routes/landing.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/**
 * Carga el JSON de la landing por slug.
 * Busca en: ../../data/landing.<slug>.json
 * Retorna un objeto con la configuración y el nombre de la plantilla.
 */
function loadLandingConfig(slug) {
  const filePath = path.join(__dirname, '../../data', `landing.${slug}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const cfg = JSON.parse(raw);
  const templateName = cfg.template || 'neo-k-landing';
  return { cfg, templateName };
}

/**
 * GET /landing/:slug
 * Renderiza la plantilla templates/<templateName>.ejs con el cfg del JSON
 */
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const { cfg, templateName } = loadLandingConfig(slug);
    return res.render(path.join('templates', templateName), { cfg, slug });
  } catch (err) {
    console.error(`[landing] error cargando ${req.params.slug}:`, err.message);
    return res.status(404).send('Landing no encontrada');
  }
});

module.exports = router;