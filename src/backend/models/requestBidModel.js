const mongoose = require('mongoose');

const RequestBidSchema = new mongoose.Schema({
  requestbid: { type: String, required: true },
  requestid: { type: mongoose.ObjectId, required: true },
  supplierid: { type: mongoose.ObjectId, required: true },
  suppliercontactid: { type: mongoose.ObjectId, required: true },
  creationdate: { type: Date },
  quantity: { type: Number },
  deliverydate: { type: Date },
  description: { type: String },
  status: { type: String },
  statusdate: { type: Date },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RequestBid', RequestBidSchema);
