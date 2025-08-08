// src/models/Category.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  slug:         { type: String, required: true, unique: true },
  name:         { type: String, required: true },
  banner:       { type: String, required: true },
  seo: {
    title:       String,
    description: String
  }
}, {
  collection: 'categories',
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);