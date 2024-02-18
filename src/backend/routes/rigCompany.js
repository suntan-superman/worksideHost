const express = require('express');
const {
  getRigCompanys,
  getRigCompany,
  createRigCompany,
  deleteRigCompany,
  updateRigCompany,
} = require('../controllers/rigCompanyController');

const router = express.Router();

// Get All RigCompanys
router.get('/', getRigCompanys);

// Get One RigCompany
router.get('/:id', getRigCompany);

// Post a New RigCompany
router.post('/', createRigCompany);

// Delete a RigCompany

router.delete('/:id', deleteRigCompany);

// Update a RigCompany
router.patch('/:id', updateRigCompany);

module.exports = router;
