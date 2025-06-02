// routes\postRoutes.js
const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById } = require("../controllers/postController");

// Public: get all posts (optionally filter by author)
router.get("/", getAllPosts);

// Public: get a single post by id
router.get("/:id", getPostById);

module.exports = router;