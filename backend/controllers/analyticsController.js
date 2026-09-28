const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const SavedOpportunity = require("../models/SavedOpportunity");

// ==========================================
// ADMIN ANALYTICS
// ==========================================

const getAdminAnalytics = async (req, res) => {
  try {
    // ------------------------------------------
    // BASIC COUNTS
    // ------------------------------------------

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalOpportunities =
      await Opportunity.countDocuments();

    const openOpportunities =
      await Opportunity.countDocuments({
        status: "Open",
      });

    const closedOpportunities =
      await Opportunity.countDocuments({
        status: "Closed",
      });

    const verifiedOpportunities =
      await Opportunity.countDocuments({
        verified: true,
      });

    const unverifiedOpportunities =
      await Opportunity.countDocuments({
        verified: false,
      });

    const totalApplications =
      await Application.countDocuments();

    const totalSaved =
      await SavedOpportunity.countDocuments();

    // ------------------------------------------
    // APPLICATION STATUS COUNTS
    // ------------------------------------------

    const interested =
      await Application.countDocuments({
        status: "Interested",
      });

    const applied =
      await Application.countDocuments({
        status: "Applied",
      });

    const shortlisted =
      await Application.countDocuments({
        status: "Shortlisted",
      });

    const selected =
      await Application.countDocuments({
        status: "Selected",
      });

    const rejected =
      await Application.countDocuments({
        status: "Rejected",
      });

    // ------------------------------------------
    // OPPORTUNITY TYPE COUNTS
    // ------------------------------------------

    const internships =
      await Opportunity.countDocuments({
        type: "Internship",
      });

    const hackathons =
      await Opportunity.countDocuments({
        type: "Hackathon",
      });

    const scholarships =
      await Opportunity.countDocuments({
        type: "Scholarship",
      });

    const workshops =
      await Opportunity.countDocuments({
        type: "Workshop",
      });

    const certifications =
      await Opportunity.countDocuments({
        type: "Certification",
      });

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    res.json({
      overview: {
        totalStudents,
        totalAdmins,
        totalOpportunities,
        openOpportunities,
        closedOpportunities,
        verifiedOpportunities,
        unverifiedOpportunities,
        totalApplications,
        totalSaved,
      },

      applications: {
        interested,
        applied,
        shortlisted,
        selected,
        rejected,
      },

      opportunityTypes: {
        internships,
        hackathons,
        scholarships,
        workshops,
        certifications,
      },
    });
  } catch (error) {
    console.error(
      "Admin analytics error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAdminAnalytics,
};