const mongoose = require('mongoose');
const Supplier = require('../models/supplierModel');

// Get All Suppliers
const getSuppliers = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const suppliers = await Supplier.find({}).sort({ suppliername: 0 });
  res.status(200).json(suppliers);
};

// Get One Supplier
const getSupplier = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Supplier Id' });
  }
  const supplier = await Supplier.findById(id);

  if (!supplier) {
    return res.status(404).json({ error: 'No such Supplier' });
  }
  return res.status(200).json(supplier);
};

// Create a New Supplier
const createSupplier = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { suppliername,
    address1,
    address2,
    city,
    zipCode,
    state,
    status,
    date,
    comment } = req.body;

  const emptyFields = [];

  if (!suppliername) {
    emptyFields.push('suppliername');
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
    const supplier = await Supplier.create({ suppliername,
      address1,
      address2,
      city,
      zipCode,
      state,
      status,
      date,
      comment });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Supplier
const deleteSupplier = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Supplier Id' });
  }
  const supplier = await Supplier.findOneAndDelete({ _id: id });

  if (!supplier) {
    return res.status(400).json({ error: 'No such Supplier' });
  }
  return res.status(200).json(supplier);
};

// Update a Supplier
const updateSupplier = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Supplier Id' });
  }
  const supplier = await Supplier.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!supplier) {
    return res.status(400).json({ error: 'No such Supplier' });
  }
  return res.status(200).json(supplier);
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier,
};
