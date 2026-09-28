const express = require("express");

const {
  saveOpportunity,
  getSavedOpportunities,
  removeSavedOpportunity,
} = require("../controllers/savedOpportunityController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Save opportunity
router.post(
  "/",
  protect,
  saveOpportunity
);

// Get my saved opportunities
router.get(
  "/my",
  protect,
  getSavedOpportunities
);

// Remove saved opportunity
router.delete(
  "/:id",
  protect,
  removeSavedOpportunity
);

module.exports = router;