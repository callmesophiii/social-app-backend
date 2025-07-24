import express from "express";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newUser = await User.create({ username, email, password });

    const token = signToken(newUser);
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    console.error("Registration error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password." });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await user.isCorrectPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user);
    res.json({ token, user: { username: user.username, email: user.email, _id: user._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
});

export default router;
