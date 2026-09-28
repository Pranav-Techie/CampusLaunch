const Opportunity = require("../models/Opportunity");

const {
  calculateMatchScore,
  getMatchLabel,
} = require("../utils/matchUtils");

const {
  getDeadlineInfo,
} = require("../utils/deadlineUtils");

// =====================================================
// HELPER
// =====================================================

const addDeadlineInfo = (opportunity) => {
  const item = opportunity.toObject
    ? opportunity.toObject()
    : opportunity;

  return {
    ...item,
    deadlineInfo: getDeadlineInfo(item.deadline),
  };
};

// =====================================================
// CREATE OPPORTUNITY
// =====================================================

const createOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      createdBy: req.user._id,
      sourceType: "manual",
    });

    return res.status(201).json({
      message: "Opportunity created successfully",
      opportunity: addDeadlineInfo(opportunity),
    });
  } catch (error) {
    console.error("Create opportunity error:", error);

    return res.status(500).json({
      message: "Failed to create opportunity",
      error: error.message,
    });
  }
};

// =====================================================
// STUDENT / PUBLIC OPPORTUNITIES
// =====================================================

const getOpportunities = async (req, res) => {
  try {
    const {
      search,
      type,
      mode,
      status,
      sort = "deadline",
    } = req.query;

    // IMPORTANT:
    // Student sees only verified opportunities
    // whose deadline has not passed.
    const filter = {
      verified: true,
      deadline: {
        $gt: new Date(),
      },
    };

    // =================================================
    // STATUS
    // =================================================

    if (status) {
      if (status.toLowerCase() === "all") {
        // Do not add a status filter.
      } else {
        filter.status = new RegExp(
          `^${status}$`,
          "i"
        );
      }
    }

    // =================================================
    // TYPE
    // =================================================

    if (type) {
      filter.type = new RegExp(
        `^${type}$`,
        "i"
      );
    }

    // =================================================
    // MODE
    // =================================================

    if (mode) {
      filter.mode = new RegExp(
        `^${mode}$`,
        "i"
      );
    }

    // =================================================
    // SEARCH
    // =================================================

    if (search && search.trim()) {
      const regex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        {
          title: regex,
        },
        {
          organization: regex,
        },
        {
          description: regex,
        },
        {
          skills: regex,
        },
      ];
    }

    // =================================================
    // SORT
    // =================================================

    let sortQuery = {
      deadline: 1,
    };

    if (sort === "newest") {
      sortQuery = {
        createdAt: -1,
      };
    }

    if (sort === "recommended") {
      sortQuery = {
        deadline: 1,
      };
    }

    // =================================================
    // DATABASE QUERY
    // =================================================

    const opportunities =
      await Opportunity.find(filter)
        .sort(sortQuery)
        .lean();

    return res.json({
      count: opportunities.length,
      opportunities:
        opportunities.map(addDeadlineInfo),
    });
  } catch (error) {
    console.error(
      "Get opportunities error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch opportunities",
      error: error.message,
    });
  }
};

// =====================================================
// ADMIN - ALL OPPORTUNITIES
// =====================================================

const getAdminOpportunities = async (
  req,
  res
) => {
  try {
    const opportunities =
      await Opportunity.find({})
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          deadline: 1,
        })
        .lean();

    return res.json({
      count: opportunities.length,
      opportunities:
        opportunities.map(addDeadlineInfo),
    });
  } catch (error) {
    console.error(
      "Get admin opportunities error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch admin opportunities",
      error: error.message,
    });
  }
};

// =====================================================
// SINGLE OPPORTUNITY
// =====================================================

const getOpportunityById = async (
  req,
  res
) => {
  try {
    const opportunity =
      await Opportunity.findById(
        req.params.id
      )
        .populate(
          "createdBy",
          "name email role"
        )
        .lean();

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    return res.json({
      opportunity:
        addDeadlineInfo(opportunity),
    });
  } catch (error) {
    console.error(
      "Get opportunity error:",
      error
    );

    return res.status(500).json({
      message: "Failed to fetch opportunity",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE OPPORTUNITY
// =====================================================

const updateOpportunity = async (
  req,
  res
) => {
  try {
    const opportunity =
      await Opportunity.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    return res.json({
      message:
        "Opportunity updated successfully",
      opportunity:
        addDeadlineInfo(opportunity),
    });
  } catch (error) {
    console.error(
      "Update opportunity error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update opportunity",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE OPPORTUNITY
// =====================================================

const deleteOpportunity = async (
  req,
  res
) => {
  try {
    const opportunity =
      await Opportunity.findByIdAndDelete(
        req.params.id
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    return res.json({
      message:
        "Opportunity deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete opportunity error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete opportunity",
      error: error.message,
    });
  }
};

// =====================================================
// VERIFY / PUBLISH
// =====================================================

const verifyOpportunity = async (
  req,
  res
) => {
  try {
    const opportunity =
      await Opportunity.findById(
        req.params.id
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    opportunity.verified = true;

    if (
      opportunity.status !== "Closed"
    ) {
      opportunity.status = "Open";
    }

    await opportunity.save();

    return res.json({
      message:
        "Opportunity verified successfully",
      opportunity:
        addDeadlineInfo(opportunity),
    });
  } catch (error) {
    console.error(
      "Verify opportunity error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to verify opportunity",
      error: error.message,
    });
  }
};

// =====================================================
// RECOMMENDED OPPORTUNITIES
// =====================================================

const getRecommendedOpportunities =
  async (req, res) => {
    try {
      const student = req.user;

      const opportunities =
        await Opportunity.find({
          verified: true,
          status: "Open",
          deadline: {
            $gt: new Date(),
          },
        })
          .sort({
            deadline: 1,
          })
          .lean();

      const recommendations =
        opportunities
          .map((opportunity) => {
            const matchScore =
              calculateMatchScore(
                student,
                opportunity
              );

            return {
              ...addDeadlineInfo(
                opportunity
              ),
              matchScore,
              matchLabel:
                getMatchLabel(
                  matchScore
                ),
            };
          })
          .sort((a, b) => {
            if (
              b.matchScore !==
              a.matchScore
            ) {
              return (
                b.matchScore -
                a.matchScore
              );
            }

            return (
              new Date(a.deadline) -
              new Date(b.deadline)
            );
          });

      return res.json({
        count:
          recommendations.length,
        opportunities:
          recommendations,
      });
    } catch (error) {
      console.error(
        "Get recommended opportunities error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch recommendations",
        error: error.message,
      });
    }
  };

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createOpportunity,
  getOpportunities,
  getAdminOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  verifyOpportunity,
  getRecommendedOpportunities,
};