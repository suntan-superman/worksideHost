const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} = require('../controllers/productController');

const router = express.Router();

// Get All Products
router.get('/', getProducts);

// Get One Product
router.get('/:id', getProduct);

// Post a New Product
router.post('/', createProduct);

// Delete a Product

router.delete('/:id', deleteProduct);

// Update a Product
router.patch('/:id', updateProduct);

module.exports = router;
