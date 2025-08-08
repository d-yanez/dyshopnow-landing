// scripts/import-to-mongo.js
const mongoose    = require('mongoose');
const path        = require('path');
const fs          = require('fs');
const Category    = require('../src/models/Category');
const Product     = require('../src/models/Product');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/landingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // 1) Leer JSON
  const categoriesJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../src/data/categories.json'), 'utf8')
  );

  for (const cat of categoriesJson) {
    // 2) Upsert categoría
    const categoryDoc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      {
        name: cat.name,
        banner: cat.banner,
        seo: cat.seo
      },
      { upsert: true, new: true }
    );

    // 3) Iterar productos
    for (const prod of cat.products) {
      const prodSlug = new URL(prod.url).pathname.split('/').pop();
      await Product.findOneAndUpdate(
        { slug: prodSlug },
        {
          name: prod.name,
          description: prod.description,
          extendedDescription: prod.extendedDescription || '',
          image: prod.image,
          sku: String(prod.sku),
          price: prod.price,
          stock: prod.stock,
          tag: prod.tag,
          url: prod.url,
          category: categoryDoc._id,
          seo: prod.seo || {},
          policies: prod.policies || '',
          aggregateRating: prod.aggregateRating || {},
          reviews: prod.reviews || []
        },
        { upsert: true }
      );
    }
  }

  console.log('✅ Import completed');
  mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});