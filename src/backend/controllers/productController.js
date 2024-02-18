const mongoose = require('mongoose');
const Product = require('../models/productModel');

// Get All Products
const getProducts = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const products = await Product.find({}).sort({ categoryname: 0, productname: 0 });
  res.status(200).json(products);
};

// Get One Product
const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Product Id' });
  }
  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ error: 'No such Product' });
  }
  return res.status(200).json(product);
};

// Create a New Product
const createProduct = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { categoryname,
    productname,
    description,
    status,
    statusdate } = req.body;
  const emptyFields = [];

  // if (!customername) {
  //   emptyFields.push('customername');
  // }
  // if (!city) {
  //   emptyFields.push('city');
  // }
  // if (!state) {
  //   emptyFields.push('state');
  // }
  // if (!status) {
  //   emptyFields.push('status');
  // }
  // if (!date) {
  //   emptyFields.push('date');
  // }
  // if (emptyFields.length > 0) {
  //   return res.status(400).json({ error: 'Please fill in required fields', emptyFields });
  // }
  try {
    // eslint-disable-next-line camelcase
    const product = await Product.create({ categoryname,
      productname,
      description,
      status,
      statusdate });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Product Id' });
  }
  const product = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    return res.status(400).json({ error: 'No such Product' });
  }
  return res.status(200).json(product);
};

// Update a Product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Product Id' });
  }
  const product = await Product.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!product) {
    return res.status(400).json({ error: 'No such Product' });
  }
  return res.status(200).json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
