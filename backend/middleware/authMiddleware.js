const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================================================
// PROTECT
// =========================================================

const protect = async (req, res, next) => {
  try {
    let token;

    // -----------------------------------------
    // Read Authorization header
    // -----------------------------------------

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];
    }

    if (!token) {
      return res.status(401).json({
        message:
          "Not authorized. Please log in again.",
      });
    }

    // -----------------------------------------
    // Verify JWT
    // -----------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    /*
     * Support all common JWT id formats.
     *
     * This prevents the "User not found"
     * problem if an older token was created
     * using userId instead of id.
     */
    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id ||
      decoded.sub;

    if (!userId) {
      return res.status(401).json({
        message:
          "Invalid authentication token.",
      });
    }

    // -----------------------------------------
    // Find user
    // -----------------------------------------

    const user =
      await User.findById(userId).select(
        "-password -resume.data"
      );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // -----------------------------------------
    // Attach user to request
    // -----------------------------------------

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        message:
          "Your session has expired. Please log in again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication token. Please log in again.",
      });
    }

    return res.status(401).json({
      message:
        "Authentication failed. Please log in again.",
    });
  }
};

// =========================================================
// ADMIN ONLY
// =========================================================

const adminOnly = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message:
        "Admin access required.",
    });
  }

  next();
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  protect,
  adminOnly,
};