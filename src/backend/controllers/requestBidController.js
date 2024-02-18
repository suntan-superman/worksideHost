const mongoose = require('mongoose');
const RequestBid = require('../models/requestBidModel');

// Get All RequestBids
const getRequestBids = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const requestBids = await RequestBid.find({}).sort({ requestbid: 0 });
  res.status(200).json(requestBids);
};

// Get One RequestBid
const getRequestBid = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RequestBid Id' });
  }
  const requestBid = await RequestBid.findById(id);

  if (!requestBid) {
    return res.status(404).json({ error: 'No such RequestBid' });
  }
  return res.status(200).json(requestBid);
};

// Create a New RequestBid
const createRequestBid = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { requestbid,
    requestid,
    supplierid,
    suppliercontactid,
    creationdate,
    quantity,
    deliverydate,
    description,
    status,
    statusdate,
    comment } = req.body;
/*
  const emptyFields = [];

  if (!requestBidname) {
    emptyFields.push('requestBidname');
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
    const requestBid = await RequestBid.create({ requestbid,
      requestid,
      supplierid,
      suppliercontactid,
      creationdate,
      quantity,
      deliverydate,
      description,
      status,
      statusdate,
      comment });
    res.status(200).json(requestBid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a RequestBid
const deleteRequestBid = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RequestBid Id' });
  }
  const requestBid = await RequestBid.findOneAndDelete({ _id: id });

  if (!requestBid) {
    return res.status(400).json({ error: 'No such RequestBid' });
  }
  return res.status(200).json(requestBid);
};

// Update a RequestBid
const updateRequestBid = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such RequestBid Id' });
  }
  const requestBid = await RequestBid.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!requestBid) {
    return res.status(400).json({ error: 'No such RequestBid' });
  }
  return res.status(200).json(requestBid);
};

module.exports = {
  getRequestBids,
  getRequestBid,
  createRequestBid,
  deleteRequestBid,
  updateRequestBid,
};
