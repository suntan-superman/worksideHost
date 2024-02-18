const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} = require('../controllers/customerController');

const router = express.Router();

// Get All Customers
router.get('/', getCustomers);

// Get One Customer
router.get('/:id', getCustomer);

// Post a New Customer
router.post('/', createCustomer);

// Delete a Customer

router.delete('/:id', deleteCustomer);

// Update a Customer
router.patch('/:id', updateCustomer);

module.exports = router;
