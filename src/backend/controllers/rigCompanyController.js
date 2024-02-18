const mongoose = require('mongoose');
const RigCompany = require('../models/rigCompanyModel');

// Get All RigCompanys
const getRigCompanys = async (req, res) => {
  console.log('Before Rig Company Call');
  // Sort: O is Ascending and -1 for Descending
  const rigCompanys = await RigCompany.find({});
  // const rigCompanys = await RigCompany.find({}).sort({ rigcompanyname: 0 });
  console.log('After Rig Company Call');
  res.status(200).json(rigCompanys);
};

// Get One RigCompany
const getRigCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RigCompany Id' });
  }
  const rigCompany = await RigCompany.findById(id);

  if (!rigCompany) {
    return res.status(404).json({ error: 'No such RigCompany' });
  }
  return res.status(200).json(rigCompany);
};

// Create a New RigCompany
const createRigCompany = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { rigcompanyname,
    address1,
    address2,
    city,
    zipCode,
    state,
    status,
    date,
    comment } = req.body;
/*
  const emptyFields = [];

  if (!rigcompanyname) {
    emptyFields.push('rigCompanyname');
  }
  if (!city) {
    emptyFields.push('city');
  }
  if (!state) {
    emptyFields.push('state');
  }
  if (!status) {
    emptyFields.push('status');
  }
  if (!date) {
    emptyFields.push('date');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in required fields', emptyFields });
  }
*/
  try {
    // eslint-disable-next-line camelcase
    const rigCompany = await RigCompany.create({ rigcompanyname,
      address1,
      address2,
      city,
      zipCode,
      state,
      status,
      date,
      comment });
    res.status(200).json(rigCompany);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a RigCompany
const deleteRigCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RigCompany Id' });
  }
  const rigCompany = await RigCompany.findOneAndDelete({ _id: id });

  if (!rigCompany) {
    return res.status(400).json({ error: 'No such RigCompany' });
  }
  return res.status(200).json(rigCompany);
};

// Update a RigCompany
const updateRigCompany = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RigCompany Id' });
  }
  const rigCompany = await RigCompany.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!rigCompany) {
    return res.status(400).json({ error: 'No such RigCompany' });
  }
  return res.status(200).json(rigCompany);
};

module.exports = {
  getRigCompanys,
  getRigCompany,
  createRigCompany,
  deleteRigCompany,
  updateRigCompany,
};
