const express = require("express");

const {
  register,
  login,
  getMe,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Always returns a generic response to avoid account enumeration.
router.post("/forgot-password", requestPasswordReset);

// Completes a reset using a token delivered out-of-band by the email provider.
router.post("/reset-password", resetPassword);

// Get currently logged-in user
router.get("/me", authMiddleware, getMe);

module.exports = router;
