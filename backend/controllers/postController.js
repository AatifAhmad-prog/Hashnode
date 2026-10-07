const mongoose = require("mongoose");
const Post = require("../models/Post");

const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const createUniqueSlug = async (title) => {
  const baseSlug = createSlug(title) || `post-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (await Post.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const calculateReadingTime = (content = "") => {
  const plainText = content.replace(/<[^>]*>/g, " ").trim();

  if (!plainText) {
    return 1;
  }

  const words = plainText.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        return tag.trim().toLowerCase();
      }

      if (tag && typeof tag === "object") {
        return String(tag.name || tag.slug || "")
          .trim()
          .toLowerCase();
      }

      return "";
    })
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
};

const normalizeTagSlug = (tag) =>
  String(tag || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

const normalizeReferences = (references) => {
  if (!Array.isArray(references)) {
    return [];
  }

  return references
    .map((reference) => ({
      title: String(reference?.title || "").trim(),
      url: String(reference?.url || "").trim(),
    }))
    .filter((reference) => reference.title || reference.url);
};

const populatePost = (query) => {
  return query.populate(
    "author",
    "name email avatarUrl bio"
  );
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getPublicPosts = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const tag = String(req.query.tag || req.query.topic || "")
      .trim()
      .toLowerCase();
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 20;
    const limit = Math.min(50, Math.max(1, requestedLimit));
    const filter = { status: "published" };

    if (search) {
      const expression = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { title: expression },
        { excerpt: expression },
        { content: expression },
        { tags: expression },
      ];
    }

    if (tag) {
      const tagExpression = new RegExp(
        `^(${escapeRegex(tag)}|${escapeRegex(tag.replace(/-/g, " "))})$`,
        "i"
      );
      filter.tags = tagExpression;
    }

    const [posts, total] = await Promise.all([
      populatePost(
        Post.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
      ).exec(),
      Post.countDocuments(filter),
    ]);

    return res.status(200).json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get public posts error:", error);

    return res.status(500).json({
      message: "Server error while fetching public posts.",
    });
  }
};

const getPostsByTag = async (req, res) => {
  return getPublicPosts(
    { query: { ...req.query, tag: req.params.slug } },
    res
  );
};

const getTopics = async (req, res) => {
  try {
    const topics = await Post.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: { $toLower: "$tags" }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]);

    return res.status(200).json({
      topics: topics.map(({ _id, count }) => ({
        name: _id,
        slug: normalizeTagSlug(_id),
        count,
      })),
    });
  } catch (error) {
    console.error("Get topics error:", error);

    return res.status(500).json({
      message: "Server error while fetching topics.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE POST
|--------------------------------------------------------------------------
*/

const createPost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      font,
      theme,
      references,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Post title is required.",
      });
    }

    const normalizedStatus =
      status === "published" ? "published" : "draft";

    const slug = await createUniqueSlug(title);

    const post = await Post.create({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || "",
      content: content || "",
      coverImage: coverImage || "",
      author: req.userId,
      tags: normalizeTags(tags),
      font: font || "editorial",
      theme: theme || "paper",
      references: normalizeReferences(references),
      status: normalizedStatus,
      readingTime: calculateReadingTime(content || ""),
    });

    const populatedPost = await populatePost(
      Post.findById(post._id)
    ).exec();

    return res.status(201).json({
      message:
        normalizedStatus === "published"
          ? "Post published successfully."
          : "Draft saved successfully.",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Server error while creating the post.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE POST
|--------------------------------------------------------------------------
|
| Supports both:
|   /api/posts/:slug
|   /api/posts/:id
|
*/

const getPostByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    let post;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      post = await populatePost(
        Post.findById(identifier)
      );
    } else {
      post = await populatePost(
        Post.findOne({ slug: identifier })
      );
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    /*
     * Published posts are publicly accessible.
     * Drafts can only be opened by their author.
     */
    if (post.status === "draft") {
      if (
        !req.userId ||
        post.author?._id?.toString() !== req.userId.toString()
      ) {
        return res.status(404).json({
          message: "Post not found.",
        });
      }
    }

    return res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    return res.status(500).json({
      message: "Server error while fetching the post.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MY POSTS
|--------------------------------------------------------------------------
*/

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.userId,
    })
      .sort({ updatedAt: -1 })
      .populate("author", "name email avatarUrl bio");

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get my posts error:", error);

    return res.status(500).json({
      message: "Server error while fetching your posts.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE POST
|--------------------------------------------------------------------------
*/

const updatePost = async (req, res) => {
  try {
    const { identifier } = req.params;

    let post;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      post = await Post.findById(identifier);
    } else {
      post = await Post.findOne({ slug: identifier });
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to edit this post.",
      });
    }

    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      font,
      theme,
      references,
      status,
    } = req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          message: "Post title cannot be empty.",
        });
      }

      post.title = String(title).trim();
    }

    if (excerpt !== undefined) {
      post.excerpt = String(excerpt).trim();
    }

    if (content !== undefined) {
      post.content = String(content);
    }

    if (coverImage !== undefined) {
      post.coverImage = String(coverImage);
    }

    if (tags !== undefined) {
      post.tags = normalizeTags(tags);
    }

    if (font !== undefined) {
      post.font = String(font);
    }

    if (theme !== undefined) {
      post.theme = String(theme);
    }

    if (references !== undefined) {
      post.references = normalizeReferences(references);
    }

    if (status !== undefined) {
      post.status =
        status === "published" ? "published" : "draft";
    }

    post.readingTime = calculateReadingTime(post.content);

    await post.save();

    const populatedPost = await populatePost(
      Post.findById(post._id)
    ).exec();

    return res.status(200).json({
      message:
        post.status === "published"
          ? "Post updated successfully."
          : "Draft updated successfully.",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      message: "Server error while updating the post.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE POST
|--------------------------------------------------------------------------
*/

const deletePost = async (req, res) => {
  try {
    const { identifier } = req.params;

    let post;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      post = await Post.findById(identifier);
    } else {
      post = await Post.findOne({ slug: identifier });
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post.",
      });
    }

    await Post.findByIdAndDelete(post._id);

    return res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      message: "Server error while deleting the post.",
    });
  }
};

module.exports = {
  createPost,
  getPublicPosts,
  getPostsByTag,
  getTopics,
  getPostByIdentifier,
  getMyPosts,
  updatePost,
  deletePost,
};
