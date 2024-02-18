const mongoose = require('mongoose');
const SupplierProduct = require('../models/supplierProductModel');

// Get All SupplierProducts
const getSupplierProducts = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const supplierProducts = await SupplierProduct.find({}).sort({ supplierProductname: 0 });
  res.status(200).json(supplierProducts);
};

// Get One SupplierProductProduct
const getSupplierProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such SupplierProduct Id' });
  }
  const supplierProduct = await SupplierProduct.findById(id);

  if (!supplierProduct) {
    return res.status(404).json({ error: 'No such SupplierProduct' });
  }
  return res.status(200).json(supplierProduct);
};

// Create a New SupplierProduct
const createSupplierProduct = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { supplierProduct_id,
    supplier,
    category,
    product,
    status,
    date,
    comment } = req.body;

  try {
    // eslint-disable-next-line camelcase
    const supplierProduct = await SupplierProduct.create({ supplierProduct_id,
      supplier,
      category,
      product,
      status,
      date,
      comment });
    res.status(200).json(supplierProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a SupplierProduct
const deleteSupplierProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such SupplierProduct Id' });
  }
  const supplierProduct = await SupplierProduct.findOneAndDelete({ _id: id });

  if (!supplierProduct) {
    return res.status(400).json({ error: 'No such SupplierProduct' });
  }
  return res.status(200).json(supplierProduct);
};

// Update a SupplierProduct
const updateSupplierProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such SupplierProduct Id' });
  }
  const supplierProduct = await SupplierProduct.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!supplierProduct) {
    return res.status(400).json({ error: 'No such SupplierProduct' });
  }
  return res.status(200).json(supplierProduct);
};

module.exports = {
  getSupplierProducts,
  getSupplierProduct,
  createSupplierProduct,
  deleteSupplierProduct,
  updateSupplierProduct,
};
