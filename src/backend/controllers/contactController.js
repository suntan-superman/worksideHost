const mongoose = require('mongoose');
const Contact = require('../models/contactModel');

// Get All Contacts
const getContacts = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const contacts = await Contact.find({}).sort({ class: 0, lastname: 0 });
  res.status(200).json(contacts);
};

// Get One Contact
const getContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Contact Id' });
  }
  const contact = await Contact.findById(id);

  if (!contact) {
    return res.status(404).json({ error: 'No such Contact' });
  }
  return res.status(200).json(contact);
};

// Create a New Contact
const createContact = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { contact_id,
    contactclass,
    accesslevel,
    username,
    userpassword,
    firstname,
    lastname,
    nickname,
    primaryphone,
    secondaryphone,
    primaryemail,
    secondaryemail,
    status,
    statusdate,
    comment,
    verified,
  } = req.body;

  try {
    // eslint-disable-next-line camelcase
    const contact = await Contact.create({ contact_id,
      contactclass,
      accesslevel,
      username,
      userpassword,
      firstname,
      lastname,
      nickname,
      primaryphone,
      secondaryphone,
      primaryemail,
      secondaryemail,
      status,
      statusdate,
      comment,
      verified });
    res.status(200).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Contact Id' });
  }
  const contact = await Contact.findOneAndDelete({ _id: id });

  if (!contact) {
    return res.status(400).json({ error: 'No such Contact' });
  }
  return res.status(200).json(contact);
};

// Update a Contact
const updateContact = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such Contact Id' });
  }
  const contact = await Contact.findOneAndUpdate({ _id: id }, {
    ...req.body });

  if (!contact) {
    return res.status(400).json({ error: 'No such Contact' });
  }
  return res.status(200).json(contact);
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
};
