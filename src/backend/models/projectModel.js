const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  properties: {
    area: { type: String, required: true },
    customer: { type: String, required: true },
    customercontact: { type: String, required: true },
    rigcompany: { type: String, required: true },
    projectname: { type: String, required: true },
    description: { type: String, required: true },
    projectedstartdate: { type: Date },
    actualstartdate: { type: Date },
    expectedduration: { type: Number },
    actualduration: { type: Number },
    status: { type: String },
    statusdate: { type: Date },
    comment: { type: String },
    latdec: { type: Number },
    longdec: { type: Number },
  },
  // geometry: {
  //   coordinates: { type: Array, required: true },
  // },
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
