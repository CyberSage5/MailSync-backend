const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    req.user = decoded;

    // Check if the user exists in the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    // Check if the user has linked their WhatsApp account
    if (!user.isGmailLinked) {
      return res.status(403).json({
        message: "Access Denied: Please link your Gmail account first.",
      });
    }

    if (!user.whatsappNumber) {
      return res.status(403).json({
        message: "Access Denied: Please link your WhatsApp account.",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token.",
      error: error.message,
    });
  }
};
