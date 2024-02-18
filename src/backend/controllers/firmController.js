const mongoose = require('mongoose');
const Firm = require('../models/firmModel');

// Get All Firms
const getFirms = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const firms = await Firm.find({}).sort({ type: 0, name: 0, area: 0 });
  res.status(200).json(firms);
};

// Get One Firm
const getFirm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Firm Id' });
  }
  const firm = await Firm.findById(id);

  if (!firm) {
    return res.status(404).json({ error: 'No such Firm' });
  }
  return res.status(200).json(firm);
};

// Create a New Firm
const createFirm = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { name,
    type,
    area,
    address1,
    address2,
    city,
    zipCode,
    state,
    status,
    date,
    comment } = req.body;

  const emptyFields = [];

  if (!name) {
    emptyFields.push('name');
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
  try {
    // eslint-disable-next-line camelcase
    const firm = await Firm.create({ name,
      type,
      area,
      address1,
      address2,
      city,
      zipCode,
      state,
      status,
      date,
      comment });
    res.status(200).json(firm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Firm
const deleteFirm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Firm Id' });
  }
  const firm = await Firm.findOneAndDelete({ _id: id });

  if (!firm) {
    return res.status(400).json({ error: 'No such Firm' });
  }
  return res.status(200).json(firm);
};

// Update a Firm
const updateFirm = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Firm Id' });
  }
  const firm = await Firm.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!firm) {
    return res.status(400).json({ error: 'No such Firm' });
  }
  return res.status(200).json(firm);
};

module.exports = {
  getFirms,
  getFirm,
  createFirm,
  deleteFirm,
  updateFirm,
};
