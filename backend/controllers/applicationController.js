const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

// =========================================================
// CREATE APPLICATION
// =========================================================

const createApplication = async (req, res) => {
  try {
    const {
      opportunityId,
      status = "Interested",
      notes = "",
    } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        message: "Opportunity ID is required",
      });
    }

    const opportunity =
      await Opportunity.findById(
        opportunityId
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    // Prevent duplicate tracking/application
    const existingApplication =
      await Application.findOne({
        student: req.user._id,
        opportunity: opportunityId,
      });

    if (existingApplication) {
      return res.status(409).json({
        message:
          "You are already tracking this opportunity",
        application: existingApplication,
      });
    }

    const application =
      await Application.create({
        student: req.user._id,
        opportunity: opportunityId,
        status,
        notes,
        appliedAt:
          status === "Applied"
            ? new Date()
            : undefined,
      });

    const populatedApplication =
      await Application.findById(
        application._id
      )
        .populate(
          "student",
          "name email college course year skills interests"
        )
        .populate(
          "opportunity",
          "title organization type deadline applicationUrl mode location stipend"
        );

    return res.status(201).json({
      message:
        "Opportunity added to your tracker",
      application:
        populatedApplication,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create application",
      error: error.message,
    });
  }
};

// =========================================================
// GET MY APPLICATIONS
// =========================================================

const getMyApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        student: req.user._id,
      })
        .populate(
          "opportunity",
          "title organization type deadline applicationUrl mode location stipend"
        )
        .sort({
          updatedAt: -1,
          createdAt: -1,
        });

    return res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get my applications error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load applications",
      error: error.message,
    });
  }
};

// =========================================================
// UPDATE APPLICATION STATUS
// =========================================================

const updateApplicationStatus = async (
  req,
  res
) => {
  try {
    const { status, notes } =
      req.body;

    const application =
      await Application.findOne({
        _id: req.params.id,
        student: req.user._id,
      });

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    if (status) {
      application.status = status;
    }

    if (notes !== undefined) {
      application.notes = notes;
    }

    if (
      status === "Applied" &&
      !application.appliedAt
    ) {
      application.appliedAt =
        new Date();
    }

    await application.save();

    const updatedApplication =
      await Application.findById(
        application._id
      ).populate(
        "opportunity",
        "title organization type deadline applicationUrl mode location stipend"
      );

    return res.json({
      message:
        "Application updated successfully",
      application:
        updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update application",
      error: error.message,
    });
  }
};

// =========================================================
// DELETE APPLICATION
// =========================================================

const deleteApplication = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findOneAndDelete({
        _id: req.params.id,
        student: req.user._id,
      });

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found",
      });
    }

    return res.json({
      message:
        "Application removed successfully",
    });
  } catch (error) {
    console.error(
      "Delete application error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete application",
      error: error.message,
    });
  }
};

// =========================================================
// ADMIN — GET ALL APPLICATIONS
// =========================================================

const getAllApplications = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({})
        .populate(
          "student",
          "name email college course year skills interests resume.filename resume.contentType resume.size resume.uploadedAt"
        )
        .populate(
          "opportunity",
          "title organization type deadline applicationUrl mode location stipend"
        )
        .sort({
          appliedAt: -1,
          updatedAt: -1,
          createdAt: -1,
        });

    return res.json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get all applications error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load all applications",
      error: error.message,
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
};