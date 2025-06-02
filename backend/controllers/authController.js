// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the user's credentials 
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, email: user.email } });
};

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    // Create the user
    const user = await User.create({ email, passwordHash: hashed });
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      console.error("Register error:", "Email already registered");
      return res.status(409).json({ message: 'Email already registered' });
    } else {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Registration failed" });
    }
  }
};

exports.verifyToken = async (req, res) => {
  try {
    // The auth middleware already verified the token
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'email']
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Token verification failed" });
  }
};