const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate the user's credentials 
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Hash the password
    const hashed = await bcrypt.hash(password, 10);
    // Create the user
    const user = await User.create({ name, email, password: hashed });
    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
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