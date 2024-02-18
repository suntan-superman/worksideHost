const mongoose = require('mongoose');

const RigSchema = new mongoose.Schema({
  rigname: { type: String, required: true },
  rignumber: { type: String, required: true },
  rigclassification: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  statusdate: { type: Date },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Rig', RigSchema);
