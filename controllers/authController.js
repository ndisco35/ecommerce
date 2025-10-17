import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await Users.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await Users.create({ username, email, password });

    res.status(201).json({
      message: "User registration successful"

    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id, user.isAdmin),
        admin: user.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid login credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


