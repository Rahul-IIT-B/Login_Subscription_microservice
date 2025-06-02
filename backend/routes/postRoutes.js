// routes\postRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createPost } = require("../controllers/postController");
const { validatePost } = require('../middleware/validation');


// Authenticated: create a post
router.post("/", auth, validatePost, createPost);

module.exports = router;