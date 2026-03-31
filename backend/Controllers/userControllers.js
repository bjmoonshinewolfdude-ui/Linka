const { request } = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const generateToken = require("../Config/generateToken");

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);

  console.log(keyword);
});

const registerUser = expressAsyncHandler(async (req, res) => {
  console.log("REQ BODY:", req.body);
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // remove accidental spaces
  const trimmedName = name.trim();

  // prevent empty names like "     "
  if (!trimmedName) {
    res.status(400);
    throw new Error("Name cannot be empty");
  }

  // enforce length limit
  if (trimmedName.length > 25) {
    res.status(400);
    throw new Error("Name cannot exceed 25 characters");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: trimmedName,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
module.exports = { registerUser, authUser, allUsers };
