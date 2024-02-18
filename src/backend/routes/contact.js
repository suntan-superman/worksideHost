const express = require('express');
const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
} = require('../controllers/contactController');

const router = express.Router();

// Get All Contacts
router.get('/', getContacts);

// Get One Contact
router.get('/:id', getContact);

// Post a New Contact
router.post('/', createContact);

// Delete a Contact

router.delete('/:id', deleteContact);

// Update a Contact
router.patch('/:id', updateContact);

module.exports = router;
