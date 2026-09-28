const express = require("express");

const {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
} = require("../controllers/applicationController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// ADMIN
// =========================================================

// IMPORTANT:
// Keep this BEFORE /:id
router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllApplications
);


// =========================================================
// STUDENT
// =========================================================

router.post(
  "/",
  protect,
  createApplication
);

router.get(
  "/my",
  protect,
  getMyApplications
);

router.patch(
  "/:id",
  protect,
  updateApplicationStatus
);

router.delete(
  "/:id",
  protect,
  deleteApplication
);


module.exports = router;