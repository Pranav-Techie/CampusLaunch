const mongoose = require("mongoose");

const savedOpportunitySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saves
savedOpportunitySchema.index(
  {
    student: 1,
    opportunity: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "SavedOpportunity",
  savedOpportunitySchema
);