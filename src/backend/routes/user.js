const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/userModel");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

// eslint-disable-next-line consistent-return
router.post("/", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) {
    //   return res.status(400).send({ message: error.details[0].message });
    // }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with given email already Exists!" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get All Users
router.get("/", getUsers);

// Get One User
router.get("/:email", getUser);

// Post a New User
// router.post('/', createUser);

// Delete a User

router.delete("/:email", deleteUser);

// Update a User
router.patch("/:email", updateUser);

module.exports = router;
