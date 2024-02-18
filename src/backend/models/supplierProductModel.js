const mongoose = require('mongoose');

const SupplierProductSchema = new mongoose.Schema({
  supplierProduct_id: { type: Number },
  supplier: { type: String, required: true },
  category: { type: String, required: true },
  product: { type: String, required: true },
  status: { type: String },
  statusdate: { type: Date },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('SupplierProduct', SupplierProductSchema);
