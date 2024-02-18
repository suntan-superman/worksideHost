const mongoose = require('mongoose');
const Rig = require('../models/rigModel');

// Get All Rigs
const getRigs = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const rigs = await Rig.find({}).sort({ rigname: 0 });
  res.status(200).json(rigs);
};

// Get One Rig
const getRig = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Rig Id' });
  }
  const rig = await Rig.findById(id);

  if (!rig) {
    return res.status(404).json({ error: 'No such Rig' });
  }
  return res.status(200).json(rig);
};

// Create a New Rig
const createRig = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { rigname,
    rignumber,
    rigclassification,
    description,
    status,
    statusdate,
    comment } = req.body;
/*
  const emptyFields = [];

  if (!rigname) {
    emptyFields.push('rigname');
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
    const rig = await Rig.create({ rigname,
      rignumber,
      rigclassification,
      description,
      status,
      statusdate,
      comment });
    res.status(200).json(rig);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Rig
const deleteRig = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Rig Id' });
  }
  const rig = await Rig.findOneAndDelete({ _id: id });

  if (!rig) {
    return res.status(400).json({ error: 'No such Rig' });
  }
  return res.status(200).json(rig);
};

// Update a Rig
const updateRig = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Rig Id' });
  }
  const rig = await Rig.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!rig) {
    return res.status(400).json({ error: 'No such Rig' });
  }
  return res.status(200).json(rig);
};

module.exports = {
  getRigs,
  getRig,
  createRig,
  deleteRig,
  updateRig,
};
