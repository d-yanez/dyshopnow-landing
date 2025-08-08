// src/models/Product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  author:        String,
  datePublished: Date,
  description:   String,
  ratingValue:   Number
}, { _id: false });

const ProductSchema = new Schema({
  slug:                { type: String, required: true, unique: true },
  name:                { type: String, required: true },
  description:         { type: String, required: true },
  extendedDescription: { type: String },
  image:               { type: String, required: true },
  sku:                 { type: String, required: true },
  price:               { type: Number, required: true },
  stock:               { type: Number, required: true },
  tag:                 String,
  url:                 { type: String, required: true },
  category:           { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  seo: {
    title:       String,
    description: String
  },
  policies:           String,
  aggregateRating: {
    ratingValue: { type: Number },
    ratingCount: { type: Number }
  },
  reviews:           [ReviewSchema]
}, {
  collection: 'products',
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);