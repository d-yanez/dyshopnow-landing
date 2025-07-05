const path = require('path');
const fs = require('fs').promises;

exports.getCatalog = async () => {
  const filePath = path.join(__dirname, '../../bucket-data/catalog.json');
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};
