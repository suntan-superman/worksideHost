const mongoose = require('mongoose');
const Customer = require('../models/customerModel');

// Get All Customers
const getCustomers = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const customers = await Customer.find({}).sort({ customername: 0 });
  res.status(200).json(customers);
};

// Get One Customer
const getCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Customer Id' });
  }
  const customer = await Customer.findById(id);

  if (!customer) {
    return res.status(404).json({ error: 'No such Customer' });
  }
  return res.status(200).json(customer);
}

// Create a New Customer
const createCustomer = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { customername,
    address1,
    address2,
    city,
    zipCode,
    state,
    status,
    date,
    comment } = req.body;

  const emptyFields = [];

  if (!customername) {
    emptyFields.push('customername');
  }
  if (!city) {
    emptyFields.push('city');
  }
  if (!state) {
    emptyFields.push('state');
  }
  if (!status) {
    emptyFields.push('status');
  }
  if (!date) {
    emptyFields.push('date');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in required fields', emptyFields });
  }
  try {
    // eslint-disable-next-line camelcase
    const customer = await Customer.create({ customername,
      address1,
      address2,
      city,
      zipCode,
      state,
      status,
      date,
      comment });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Customer Id' });
  }
  const customer = await Customer.findOneAndDelete({ _id: id });

  if (!customer) {
    return res.status(400).json({ error: 'No such Customer' });
  }
  return res.status(200).json(customer);
}

// Update a Customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Customer Id' });
  }
  const customer = await Customer.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!customer) {
    return res.status(400).json({ error: 'No such Customer' });
  }
  return res.status(200).json(customer);
}

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
}