const dataService = require('../services/dataService');
const seoHelper = require('../utils/seoHelper');

exports.renderHome = async (req, res) => {
  try {
    const catalog = await dataService.getCatalog();
    const seo = seoHelper.generateHomeMeta();
    res.render('home', { categories: catalog.categories, seo });
  } catch (err) {
    console.error('Error renderizando home:', err);
    res.status(500).send('Error interno del servidor');
  }
};
