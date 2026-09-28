const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const SavedOpportunity = require("../models/SavedOpportunity");
const { getDeadlineInfo } = require("../utils/deadlineUtils");
const { calculateMatchScore, getMatchLabel } = require("../utils/matchUtils");

// ==========================================
// GET STUDENT DASHBOARD
// ==========================================
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student profile
    const student = await User.findById(studentId).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    // Get student's applications
    const applications = await Application.find({
      student: studentId,
    })
      .populate("opportunity")
      .sort({ updatedAt: -1 });

    // Get student's saved opportunities
    const savedOpportunities =
      await SavedOpportunity.find({
        student: studentId,
      })
        .populate("opportunity")
        .sort({ createdAt: -1 });

    // Get open opportunities
    const opportunities = await Opportunity.find({
      status: "Open",
    })
      .populate("createdBy", "name email role")
      .sort({ deadline: 1 });

    // Add deadline intelligence
    const opportunitiesWithDeadline =
  opportunities.map((opportunity) => {
    const matchScore =
      calculateMatchScore(
        student,
        opportunity
      );

    return {
      ...opportunity.toObject(),

      matchScore,

      matchLabel:
        getMatchLabel(matchScore),

      deadlineInfo:
        getDeadlineInfo(
          opportunity.deadline
        ),
    };
  });

  const recommendedOpportunities =
  [...opportunitiesWithDeadline]
    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    )
    .slice(0, 10);

    // Calculate application statistics
    const applicationStats = {
      total: applications.length,

      interested: applications.filter(
        (app) => app.status === "Interested"
      ).length,

      applied: applications.filter(
        (app) => app.status === "Applied"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "Shortlisted"
      ).length,

      selected: applications.filter(
        (app) => app.status === "Selected"
      ).length,
    };

    // Upcoming deadlines
    const upcomingDeadlines =
      opportunitiesWithDeadline
        .filter(
          (opportunity) =>
            !opportunity.deadlineInfo.isExpired
        )
        .slice(0, 5);

    res.json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        college: student.college,
        course: student.course,
        year: student.year,
        skills: student.skills,
        interests: student.interests,
      },

      stats: {
        applications: applicationStats,
        saved: savedOpportunities.length,
      },

      recommendedOpportunities,

      upcomingDeadlines,

      applications,

      savedOpportunities,
    });
  } catch (error) {
    console.error(
      "Get student dashboard error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getStudentDashboard,
};