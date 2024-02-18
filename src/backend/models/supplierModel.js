const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  supplier_id: 'number',
  suppliername: 'string',
  area: 'string',
  address1: 'string',
  address2: 'string',
  city: 'string',
  state: 'string',
  zipCode: 'string',
  mailingaddress1: 'string',
  mailingaddress2: 'string',
  mailingcity: 'string',
  mailingstate: 'string',
  mailingzipcode: 'string',
  status: 'string',
  statusdate: 'date',
  comment: 'string',
  // contacts: "SupplierContact[]",
  // suppliers: "Supplier[]"
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);
