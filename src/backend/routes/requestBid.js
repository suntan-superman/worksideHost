const express = require('express');
const {
  getRequestBids,
  getRequestBid,
  createRequestBid,
  deleteRequestBid,
  updateRequestBid,
} = require('../controllers/requestBidController');

const router = express.Router();

// Get All RequestBids
router.get('/', getRequestBids);

// Get One RequestBid
router.get('/:id', getRequestBid);

// Post a New RequestBid
router.post('/', createRequestBid);

// Delete a RequestBid

router.delete('/:id', deleteRequestBid);

// Update a RequestBid
router.patch('/:id', updateRequestBid);

module.exports = router;
