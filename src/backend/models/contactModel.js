const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  contact_id: { type: Number },
  contactclass: { type: String, required: true },
  accesslevel: { type: String },
  username: { type: String, required: true },
  userpassword: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  nickname: { type: String },
  primaryphone: { type: String },
  secondaryphone: { type: String },
  primaryemail: { type: String, required: true },
  secondaryemail: { type: String },
  status: { type: String },
  statusdate: { type: Date },
  comment: { type: String },
  verified: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
