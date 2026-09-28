const Opportunity = require("../models/Opportunity");
const {
  fetchHimalayasOpportunities,
} = require("../services/opportunitySources/himalayas");

const syncHimalayasOpportunities = async (req, res) => {
  try {
    const opportunities =
      await fetchHimalayasOpportunities();

    let created = 0;
    let updated = 0;
    let skipped = 0;

    const userId =
      req.user?._id ||
      req.user?.id ||
      req.user?.userId ||
      req.user?.user?._id ||
      null;

    for (const data of opportunities) {
      try {
        if (
          !data.externalId ||
          !data.applicationUrl ||
          !data.deadline
        ) {
          skipped += 1;
          continue;
        }

        const existing =
          await Opportunity.findOne({
            source: "Himalayas",
            externalId: data.externalId,
          });

        if (existing) {
          const previousVerified =
            existing.verified;

          existing.title = data.title;
          existing.organization =
            data.organization;
          existing.type = data.type;
          existing.description =
            data.description;
          existing.eligibility =
            data.eligibility;
          existing.skills = data.skills;
          existing.location =
            data.location;
          existing.mode = data.mode;
          existing.stipend =
            data.stipend;
          existing.deadline =
            data.deadline;
          existing.applicationUrl =
            data.applicationUrl;
          existing.sourceUrl =
            data.sourceUrl;
          existing.sourceType =
            "api";
          existing.importedAt =
            data.importedAt;

          // Preserve admin verification.
          existing.verified =
            previousVerified;

          if (existing.status !== "Closed") {
            existing.status = "Open";
          }

          if (!existing.createdBy && userId) {
            existing.createdBy = userId;
          }

          await existing.save();

          updated += 1;
          continue;
        }

        await Opportunity.create({
          ...data,

          createdBy: userId,

          sourceType: "api",

          verified: false,

          status: "Open",
        });

        created += 1;
      } catch (itemError) {
        console.error(
          "Failed to sync individual Himalayas opportunity:",
          itemError
        );

        skipped += 1;
      }
    }

    return res.json({
      message:
        "Himalayas opportunities synced successfully",

      source: "Himalayas",

      fetched: opportunities.length,

      created,

      updated,

      skipped,
    });
  } catch (error) {
    console.error(
      "Himalayas sync error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to sync Himalayas opportunities",

      error: error.message,
    });
  }
};

module.exports = {
  syncHimalayasOpportunities,
};