const express = require("express");

const {
  createPost,
  getPublicPosts,
  getPostsByTag,
  getTopics,
  getPostByIdentifier,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Published posts for the feed, with optional search/tag filters
router.get("/", getPublicPosts);

// Published topic/tag summary and topic-specific feed
router.get("/topics", getTopics);
router.get("/tags/:slug/posts", getPostsByTag);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

// Get all posts belonging to the logged-in user
router.get("/mine", authMiddleware, getMyPosts);

// Create a new post or draft
router.post("/", authMiddleware, createPost);

// Update an existing post
router.put("/:identifier", authMiddleware, updatePost);

// Delete an existing post
router.delete("/:identifier", authMiddleware, deletePost);

// Get a post by MongoDB ID or slug
router.get("/:identifier", getPostByIdentifier);

module.exports = router;
