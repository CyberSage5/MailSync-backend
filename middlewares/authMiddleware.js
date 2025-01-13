const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import your User model

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Now check if the user has linked their WhatsApp account
    const user = await User.findById(req.user.id);

    if (!user || !user.whatsappSession) {
      return res.status(401).json({ message: "Please link your WhatsApp account." });
    }

    // If the user is authenticated and has linked their WhatsApp, continue
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
