const express = require('express');
const {
  getRigs,
  getRig,
  createRig,
  deleteRig,
  updateRig,
} = require('../controllers/rigController');

const router = express.Router();

// Get All Rigs
router.get('/', getRigs);

// Get One Rig
router.get('/:id', getRig);

// Post a New Rig
router.post('/', createRig);

// Delete a Rig

router.delete('/:id', deleteRig);

// Update a Rig
router.patch('/:id', updateRig);

module.exports = router;
