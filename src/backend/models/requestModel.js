const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    request_id: { type: Number },
    requestname: { type: String, required: true },
    requestcategory: { type: String, required: true },
    customername: { type: String, required: true },
    customercontact: { type: String, required: true },
    projectname: { type: String, required: true },
    rigcompany: { type: String, required: true },
    rigcompanycontact: { type: String, required: true },
    creationdate: { type: Date },
    quantity: { type: Number },
    vendortype: { type: String },
    datetimerequested: { type: String },
    reqlinkname: { type: String },
    reqlinkid: { type: mongoose.ObjectId },
    description: { type: String },
    status: { type: String },
    statusdate: { type: Date },
    comment: { type: String },
    project_id: { type: mongoose.ObjectId },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);

// requestname: { type: String, required: true },
// customerid: { type: mongoose.ObjectId, required: true },
// customercontactid: { type: mongoose.ObjectId, required: true },
// rigcompanyid: { type: mongoose.ObjectId, required: true },
// rigcompanycontactid: { type: mongoose.ObjectId, required: true },
// creationdate: { type: Date },
// quantity: { type: Number },
// vendortype: { type: String },
// datetimerequested: { type: String },
// reqlinkname: { type: String },
// reqlinkid: { type: mongoose.ObjectId },
// description: { type: String },
// status: { type: String },
// statusdate: { type: Date },
// comment: { type: String },
