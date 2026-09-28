const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Internship",
        "Hackathon",
        "Scholarship",
        "Workshop",
        "Certification",
        "Event",
      ],
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    eligibility: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    mode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },

    stipend: {
      type: String,
      default: "",
      trim: true,
    },

    deadline: {
      type: Date,
      required: true,
    },

    applicationUrl: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      default: "Manual",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    externalId: {
      type: String,
      default: "",
      trim: true,
    },

    sourceType: {
      type: String,
      enum: ["manual", "api"],
      default: "manual",
    },

    importedAt: {
      type: Date,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

opportunitySchema.index({
  title: "text",
  organization: "text",
  description: "text",
});

opportunitySchema.index({
  deadline: 1,
  status: 1,
  verified: 1,
});

opportunitySchema.index({
  source: 1,
  externalId: 1,
});

module.exports = mongoose.model("Opportunity", opportunitySchema);