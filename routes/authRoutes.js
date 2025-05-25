const express = require("express");
const { login, register } = require("../controllers/authController");
const router = express.Router();
const { validateAuth } = require('../middleware/validation');

router.post("/register", validateAuth, register);
router.post("/login", validateAuth, login);

module.exports = router;
