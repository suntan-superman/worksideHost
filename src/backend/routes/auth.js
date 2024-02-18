/* eslint-disable no-tabs */
const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userSchema');
require('dotenv').config();

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label('Email'),
    password: Joi.string().required().label('Password'),
  });
  return schema.validate(data);
};

// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid Email' });
    }
    // return res.status(401).send({ message: "Invalid Email or Password" });
console.log('User good');
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!validPassword) {
      return res.status(401).send({ message: 'Invalid Password' });
    }
console.log('Password good');
    // return res.status(401).send({ message: "Invalid Email or Password" });
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWTPRIVATEKEY,
      {
        expiresIn: '7d',
      });
    res.status(200).send({ data: token, message: 'Logged in Successfully Auth' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
