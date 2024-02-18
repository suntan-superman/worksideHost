const express = require('express');
const {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest,
  updateRequest,
} = require('../controllers/requestController');

const router = express.Router();

// Get All Requests
router.get('/', getRequests);

// Get One Request
router.get('/:id', getRequest);

// Post a New Request
router.post('/', createRequest);

// Delete a Request

router.delete('/:id', deleteRequest);

// Update a Request
router.patch('/:id', updateRequest);

module.exports = router;
