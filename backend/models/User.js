const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // Store only a digest so a database leak cannot be used as a reset link.
    resetPasswordTokenHash: {
      type: String,
      select: false,
      default: undefined,
    },

    resetPasswordExpiresAt: {
      type: Date,
      select: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
