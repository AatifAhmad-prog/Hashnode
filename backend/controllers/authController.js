const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// =========================
// REGISTER
// =========================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
};

// =========================
// LOGIN
// =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
};

// =========================
// GET CURRENT USER
// =========================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Server error while fetching user.",
    });
  }
};

// =========================
// REQUEST PASSWORD RESET
// =========================

const requestPasswordReset = async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.email || "")
      .toLowerCase()
      .trim();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // The token is intended for delivery by a configured email provider.
      // This backend deliberately does not return or log it.
      const token = crypto.randomBytes(32).toString("hex");
      user.resetPasswordTokenHash = hashResetToken(token);
      user.resetPasswordExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
      await user.save();
    }

    // Keep this response identical for known and unknown addresses.
    return res.status(200).json({
      message: "If an account exists for that email, reset instructions will be sent.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);

    return res.status(500).json({
      message: "Server error while requesting a password reset.",
    });
  }
};

// =========================
// COMPLETE PASSWORD RESET
// =========================

const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const password = String(req.body?.password || "");

    if (!token || !password) {
      return res.status(400).json({
        message: "Reset token and new password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({
      resetPasswordTokenHash: hashResetToken(token),
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select("+resetPasswordTokenHash +resetPasswordExpiresAt");

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or expired.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Server error while resetting the password.",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  requestPasswordReset,
  resetPassword,
};
