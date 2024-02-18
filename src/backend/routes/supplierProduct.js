const express = require('express');
const {
  getSupplierProducts,
  getSupplierProduct,
  createSupplierProduct,
  deleteSupplierProduct,
  updateSupplierProduct,
} = require('../controllers/supplierProductController');

const router = express.Router();

// Get All SupplierProducts
router.get('/', getSupplierProducts);

// Get One SupplierProduct
router.get('/:id', getSupplierProduct);

// Post a New SupplierProduct
router.post('/', createSupplierProduct);

// Delete a SupplierProduct

router.delete('/:id', deleteSupplierProduct);

// Update a SupplierProduct
router.patch('/:id', updateSupplierProduct);

module.exports = router;
