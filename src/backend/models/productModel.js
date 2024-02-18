const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  categoryname: { type: String, required: true },
  productname: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  statusdate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
