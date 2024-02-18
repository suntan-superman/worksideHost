const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
          customer_id: 'number',
          customername: 'string',
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
          // contacts: "CustomerContact[]",
          // suppliers: "Supplier[]"
    }, {timestamps: true});

module.exports = mongoose.model('Customer', CustomerSchema);
