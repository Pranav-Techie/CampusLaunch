const SavedOpportunity = require("../models/SavedOpportunity");
const Opportunity = require("../models/Opportunity");

// ==========================================
// SAVE OPPORTUNITY
// ==========================================
const saveOpportunity = async (req, res) => {
  try {
    const { opportunityId } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        message: "Opportunity ID is required",
      });
    }

    const opportunity = await Opportunity.findById(
      opportunityId
    );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    const existingSave = await SavedOpportunity.findOne({
      student: req.user.id,
      opportunity: opportunityId,
    });

    if (existingSave) {
      return res.status(409).json({
        message: "Opportunity already saved",
      });
    }

    const saved = await SavedOpportunity.create({
      student: req.user.id,
      opportunity: opportunityId,
    });

    const populatedSave =
      await SavedOpportunity.findById(saved._id)
        .populate("opportunity");

    res.status(201).json({
      message: "Opportunity saved successfully",
      savedOpportunity: populatedSave,
    });
  } catch (error) {
    console.error("Save opportunity error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET MY SAVED OPPORTUNITIES
// ==========================================
const getSavedOpportunities = async (req, res) => {
  try {
    const savedOpportunities =
      await SavedOpportunity.find({
        student: req.user.id,
      })
        .populate("opportunity")
        .sort({ createdAt: -1 });

    res.json({
      count: savedOpportunities.length,
      savedOpportunities,
    });
  } catch (error) {
    console.error(
      "Get saved opportunities error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// REMOVE SAVED OPPORTUNITY
// ==========================================
const removeSavedOpportunity = async (req, res) => {
  try {
    const saved =
      await SavedOpportunity.findOne({
        _id: req.params.id,
        student: req.user.id,
      });

    if (!saved) {
      return res.status(404).json({
        message: "Saved opportunity not found",
      });
    }

    await saved.deleteOne();

    res.json({
      message: "Opportunity removed from saved list",
    });
  } catch (error) {
    console.error(
      "Remove saved opportunity error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  saveOpportunity,
  getSavedOpportunities,
  removeSavedOpportunity,
};