const express = require("express");

const {
  getAdminAnalytics,
} = require("../controllers/analyticsController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * GET /api/analytics
 * Admin-only platform analytics
 */
router.get(
  "/",
  protect,
  adminOnly,
  getAdminAnalytics
);

module.exports = router;