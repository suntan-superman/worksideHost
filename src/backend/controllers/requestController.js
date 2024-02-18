const mongoose = require('mongoose');
const Request = require('../models/requestModel');

// Get All Requests
const getRequests = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const requests = await Request.find({}).sort({ requestname: 0 });
  res.status(200).json(requests);
};

// Get One Request
const getRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Request Id' });
  }
  const request = await Request.findById(id);

  if (!request) {
    return res.status(404).json({ error: 'No such Request' });
  }
  return res.status(200).json(request);
};

// Create a New Request
const createRequest = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { request_id,
    requestname,
    customername,
    customercontact,
    projectname,
    rigcompany,
    rigcompanycontact,
    creationdate,
    quantity,
    vendortype,
    datetimerequested,
    reqlinkname,
    reqlinkid,
    description,
    status,
    statusdate,
    comment } = req.body;
/*
  const emptyFields = [];

  if (!requestname) {
    emptyFields.push('requestname');
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
    const request = await Request.create({ request_id,
      requestname,
      customername,
      customercontact,
      projectname,
      rigcompany,
      rigcompanycontact,
      creationdate,
      quantity,
      vendortype,
      datetimerequested,
      reqlinkname,
      reqlinkid,
      description,
      status,
      statusdate,
      comment });
    res.status(200).json(request);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Request
const deleteRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Request Id' });
  }
  const request = await Request.findOneAndDelete({ _id: id });

  if (!request) {
    return res.status(400).json({ error: 'No such Request' });
  }
  return res.status(200).json(request);
};

// Update a Request
const updateRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Request Id' });
  }
  const request = await Request.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!request) {
    return res.status(400).json({ error: 'No such Request' });
  }
  return res.status(200).json(request);
};

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest,
  updateRequest,
};
