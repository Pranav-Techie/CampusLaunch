const Notification = require("../models/Notification");
const {
    generateDeadlineNotifications,
} = require("../utils/deadlineNotifications");

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getMyNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        user: req.user.id,
      })
        .populate(
          "opportunity",
          "title organization deadline"
        )
        .sort({
          createdAt: -1,
        });

    const unreadCount =
      await Notification.countDocuments({
        user: req.user.id,
        read: false,
      });

    res.json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.read = true;

    await notification.save();

    res.json({
      message:
        "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GENERATE DEADLINE NOTIFICATIONS
// ==========================================

const generateDeadlineNotificationsController =
  async (req, res) => {
    try {
      const result =
        await generateDeadlineNotifications();

      res.json({
        message:
          "Deadline notifications generated successfully",
        ...result,
      });
    } catch (error) {
      console.error(
        "Generate deadline notifications error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  };

module.exports = {
  getMyNotifications,
  markAsRead,
  generateDeadlineNotificationsController,
};