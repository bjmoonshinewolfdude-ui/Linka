/**
 * User Model
 * Defines user schema with authentication fields
 * Includes: Name, email, password (hashed), role, profile picture
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define user schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  { timestamps: true }, // Add createdAt and updatedAt fields
);

/**
 * Compare entered password with stored hash
 * @param {string} enteredPassword - Password from login attempt
 * @returns {boolean} - True if passwords match
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Pre-save middleware to hash password before saving
 * Only runs when password field is modified
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // Generate salt and hash password using bcrypt
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create and export User model
const User = mongoose.model("User", userSchema);

module.exports = User;
