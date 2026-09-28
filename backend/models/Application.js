const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: [
        "Interested",
        "Applied",
        "Shortlisted",
        "Selected",
        "Rejected",
      ],
      default: "Interested",
    },

    appliedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from creating duplicate applications
applicationSchema.index(
  {
    student: 1,
    opportunity: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Application",
  applicationSchema
);