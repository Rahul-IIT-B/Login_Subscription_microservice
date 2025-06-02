// controllers/postController.js
const { Post, User } = require("../models");

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user.userId
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const where = {};
    if (req.query.author) {
      where.authorId = req.query.author;
    }
    const posts = await Post.findAll({
      where,
      include: [{ model: User, attributes: ["id", "email"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "email"] }],
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};