const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const Joi = require('joi');
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

// Get All Users
const getUsers = async (req, res) => {
  // Sort: O is Ascending and -1 for Descending
  const users = await User.find({}).sort({ lastname: 0 });
  res.status(200).json(users);
};

// Get One User  By Email
const getUser = async (req, res) => {
  // console.log('Email: ' + req.params.email);

  const user = await User.findOne({ email: req.params.email });
  if (!user) {
    return res.status(404).json({ error: "No such Email" });
  }
  //   console.log('Body pw: ' + req.query.password);
  // console.log('User: ' + user.password);
  const validPassword = await bcrypt.compare(req.query.password, user.password);

  if (!validPassword) {
    return res.status(401).send({ message: "Invalid Password" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  const resData = {
    userToken: token,
    user: user.firstName,
  };
  res.status(200).json(resData);
};

// Create a New User
const createUser = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { firstname, lastname, email, company, password } = req.body;
  console.log("First: " + firstname);

  //   const emptyFields = [];

  //   if (!customername) {
  //     emptyFields.push('customername');
  //   }
  //   if (!city) {
  //     emptyFields.push('city');
  //   }
  //   if (!state) {
  //     emptyFields.push('state');
  //   }
  //   if (!status) {
  //     emptyFields.push('status');
  //   }
  //   if (!date) {
  //     emptyFields.push('date');
  //   }
  //   if (emptyFields.length > 0) {
  //     return res.status(400).json({ error: 'Please fill in required fields', emptyFields });
  //   }
  try {
    console.log("Body pw: " + password);
    // eslint-disable-next-line camelcase
    const user = await User.create({
      firstname,
      lastname,
      email,
      company,
      password,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a User
const deleteUser = async (req, res) => {
  const { reqEmail } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reqEmail)) {
    return res.status(404).json({ error: "No such Email" });
  }
  const user = await User.findOneAndDelete({ email: reqEmail });

  if (!user) {
    return res.status(400).json({ error: "No such User" });
  }
  return res.status(200).json(user);
};

// Update a User
const updateUser = async (req, res) => {
  const { reqEmail } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reqEmail)) {
    return res.status(404).json({ error: "No such Email" });
  }
  const user = await User.findOneAndUpdate(
    { email: reqEmail },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(400).json({ error: "No such User" });
  }
  return res.status(200).json(user);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
