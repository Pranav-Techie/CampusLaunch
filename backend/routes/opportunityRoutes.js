const express = require("express");

const {
  createOpportunity,
  getOpportunities,
  getAdminOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  verifyOpportunity,
  getRecommendedOpportunities,
} = require("../controllers/opportunityController");

const {
  syncHimalayasOpportunities,
} = require("../controllers/opportunitySyncController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// STUDENT / PUBLIC OPPORTUNITIES
// =====================================================

router.get(
  "/",
  getOpportunities
);

// =====================================================
// STUDENT RECOMMENDATIONS
// MUST COME BEFORE /:id
// =====================================================

router.get(
  "/recommended",
  protect,
  getRecommendedOpportunities
);

// =====================================================
// ADMIN - ALL OPPORTUNITIES
// MUST COME BEFORE /:id
// =====================================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminOpportunities
);

// =====================================================
// ADMIN - HIMALAYAS SYNC
// MUST COME BEFORE /:id
// =====================================================

router.post(
  "/sync/himalayas",
  protect,
  adminOnly,
  syncHimalayasOpportunities
);

// =====================================================
// SINGLE OPPORTUNITY
// =====================================================

router.get(
  "/:id",
  getOpportunityById
);

// =====================================================
// ADMIN - CREATE
// =====================================================

router.post(
  "/",
  protect,
  adminOnly,
  createOpportunity
);

// =====================================================
// ADMIN - UPDATE
// =====================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  updateOpportunity
);

// =====================================================
// ADMIN - DELETE
// =====================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteOpportunity
);

// =====================================================
// ADMIN - VERIFY
// =====================================================

router.patch(
  "/:id/verify",
  protect,
  adminOnly,
  verifyOpportunity
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;