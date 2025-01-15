const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    verificationToken: { type: String }, // Token for email verification
    verificationTokenExpires: { type: Date }, // Token expiration time
    whatsappNumber: { type: String, required: false }, // Optional field for WhatsApp linking
    accessToken: { type: String, required: false }, // OAuth access token for Gmail
    refreshToken: { type: String, required: false }, // OAuth refresh token for Gmail
    lastHistoryId: { type: String, default: null }, // For Gmail History API
    importantSources: { type: [String], default: [] }, // List of important email sources
    isGmailLinked: { type: Boolean, default: false }, // Gmail linked status
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
