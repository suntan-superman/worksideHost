const mongoose = require('mongoose');

const RigCompanySchema = new mongoose.Schema({
  // rigCompany_id: { type: Number, required: true },
  rigCompanyname: { type: String, required: true },
  area: { type: String, required: true },
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  mailingaddress1: { type: String },
  mailingaddress2: { type: String },
  mailingcity: { type: String },
  mailingstate: { type: String },
  mailingzipcode: { type: String },
  status: { type: String },
  statusdate: { type: Date },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RigCompany', RigCompanySchema);
