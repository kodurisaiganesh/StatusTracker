import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header ) {
      return res.status(401).json({ success: false, message: "Please log in first" });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// Restrict a route to specific roles — use after requireAuth
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
}