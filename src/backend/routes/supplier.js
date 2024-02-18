const express = require('express');
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  updateSupplier,
} = require('../controllers/supplierController');

const router = express.Router();

// Get All Suppliers
router.get('/', getSuppliers);

// Get One Supplier
router.get('/:id', getSupplier);

// Post a New Supplier
router.post('/', createSupplier);

// Delete a Supplier

router.delete('/:id', deleteSupplier);

// Update a Supplier
router.patch('/:id', updateSupplier);

module.exports = router;
