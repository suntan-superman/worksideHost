const express = require('express');
const {
  getFirms,
  getFirm,
  createFirm,
  deleteFirm,
  updateFirm,
} = require('../controllers/firmController');

const router = express.Router();

// Get All Firms
router.get('/', getFirms);

// Get One Firm
router.get('/:id', getFirm);

// Post a New Firm
router.post('/', createFirm);

// Delete a Firm

router.delete('/:id', deleteFirm);

// Update a Firm
router.patch('/:id', updateFirm);

module.exports = router;
