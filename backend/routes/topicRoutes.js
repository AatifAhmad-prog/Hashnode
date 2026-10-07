const express = require("express");

const {
  getPostsByTag,
  getTopics,
} = require("../controllers/postController");

const router = express.Router();

// Topic index and published posts for a topic are public.
router.get("/topics", getTopics);
router.get("/tags", getTopics);
router.get("/tags/:slug/posts", getPostsByTag);

module.exports = router;
