const express = require("express");

const {
  getMyNotifications,
  markAsRead,
  generateDeadlineNotificationsController,
} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get(
  "/my",
  protect,
  getMyNotifications
);

// ==========================================
// MARK AS READ
// ==========================================

router.patch(
  "/:id/read",
  protect,
  markAsRead
);

router.post(
    "/generate-deadline-notifications",
    protect,
    generateDeadlineNotificationsController
);

module.exports = router;