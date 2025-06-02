// routes\authRoutes.js
const express = require("express");
const { login, signup } = require("../controllers/authController");
const router = express.Router();
const { validateAuth } = require('../middleware/validation');

router.post("/signup", validateAuth, signup);
router.post("/login", validateAuth, login);

module.exports = router;
