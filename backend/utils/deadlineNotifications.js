const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const User = require("../models/User");

const {
  sendDeadlineEmail,
} = require("./emailService");

const {
  sendWhatsAppMessage,
} = require("./whatsappService");

const generateDeadlineNotifications = async () => {
  try {
    const now = new Date();

    const opportunities = await Opportunity.find({
      status: "Open",
      deadline: {
        $gte: now,
      },
    });

    let createdCount = 0;

    let emailSentCount = 0;
    let emailFailedCount = 0;

    let whatsappSentCount = 0;
    let whatsappFailedCount = 0;

    const emailErrors = [];
    const whatsappErrors = [];

    for (const opportunity of opportunities) {
      const deadline = new Date(
        opportunity.deadline
      );

      const diffMs = deadline - now;

      const daysLeft = Math.ceil(
        diffMs / (1000 * 60 * 60 * 24)
      );

      let reminderType = null;
      let message = "";

      /*
       * 1 DAY
       */
      if (daysLeft <= 1) {
        reminderType = "1-day";

        message =
          `${opportunity.title} deadline is tomorrow or today. ` +
          `Apply before it closes.`;
      }

      /*
       * 2-3 DAYS
       */
      else if (daysLeft <= 3) {
        reminderType = "3-day";

        message =
          `${opportunity.title} deadline is in ${daysLeft} days.`;
      }

      /*
       * 4-7 DAYS
       */
      else if (daysLeft <= 7) {
        reminderType = "7-day";

        message =
          `${opportunity.title} deadline is in ${daysLeft} days.`;
      }

      /*
       * More than 7 days away
       */
      if (!reminderType) {
        continue;
      }

      /*
       * Find students who tracked/applied
       * for this opportunity.
       */
      const applications =
        await Application.find({
          opportunity: opportunity._id,
        }).select("student");

      for (const application of applications) {
        /*
         * Get student information from MongoDB.
         */
        const student =
          await User.findById(
            application.student
          ).select("name email phone");

        if (!student) {
          console.warn(
            `Student ${application.student} not found.`
          );

          continue;
        }

        if (!student.email && !student.phone) {
          console.warn(
            `No email or phone found for student ${application.student}.`
          );

          continue;
        }

        console.log(
          `Checking deadline reminder for ${student.name}`
        );

        /*
         * Check whether this reminder already exists.
         */
        let notification =
          await Notification.findOne({
            user: application.student,
            opportunity: opportunity._id,
            type: "deadline",
            "metadata.reminderType":
              reminderType,
          });

        /*
         * Create notification if it doesn't exist.
         */
        if (!notification) {
          notification =
            await Notification.create({
              user: application.student,
              opportunity: opportunity._id,
              type: "deadline",
              title: "Deadline Reminder",
              message,
              read: false,
              scheduledFor: deadline,
              metadata: {
                reminderType,
                emailSent: false,
                whatsappSent: false,
              },
            });

          createdCount++;

          console.log(
            `Created ${reminderType} notification for ${student.name}`
          );
        }

        /*
         * =========================================
         * EMAIL
         * =========================================
         */

        if (
          student.email &&
          notification.metadata?.emailSent !== true
        ) {
          try {
            console.log(
              `Sending deadline email to ${student.email}...`
            );

            await sendDeadlineEmail({
              to: student.email,
              name: student.name || "there",
              opportunity,
              daysLeft,
              deadline,
            });

            await Notification.findByIdAndUpdate(
              notification._id,
              {
                $set: {
                  "metadata.emailSent": true,
                },
              }
            );

            emailSentCount++;

            console.log(
              `EMAIL SENT SUCCESSFULLY → ${student.email}`
            );
          } catch (emailError) {
            emailFailedCount++;

            const errorMessage =
              emailError?.message ||
              emailError?.error?.message ||
              String(emailError);

            emailErrors.push({
              student: student.name,
              email: student.email,
              opportunity: opportunity.title,
              error: errorMessage,
            });

            console.error(
              `EMAIL FAILED → ${student.email}`
            );

            console.error(
              "Resend error:",
              errorMessage
            );
          }
        }

        /*
         * =========================================
         * WHATSAPP
         * =========================================
         */

        if (
          student.phone &&
          notification.metadata?.whatsappSent !== true
        ) {
          try {
            console.log(
              `Sending WhatsApp reminder to ${student.phone}...`
            );

            await sendWhatsAppMessage({
              to: student.phone,
              name: student.name || "there",
              opportunity,
              daysLeft,
            });

            await Notification.findByIdAndUpdate(
              notification._id,
              {
                $set: {
                  "metadata.whatsappSent": true,
                },
              }
            );

            whatsappSentCount++;

            console.log(
              `WHATSAPP SENT SUCCESSFULLY → ${student.phone}`
            );
          } catch (whatsappError) {
            whatsappFailedCount++;

            const errorMessage =
              whatsappError?.response?.data ||
              whatsappError?.message ||
              String(whatsappError);

            whatsappErrors.push({
              student: student.name,
              phone: student.phone,
              opportunity: opportunity.title,
              error: errorMessage,
            });

            console.error(
              `WHATSAPP FAILED → ${student.phone}`
            );

            console.error(
              "WhatsApp error:",
              errorMessage
            );
          }
        }
      }
    }

    console.log(
      `Deadline notifications: ${createdCount} created, ` +
      `${emailSentCount} emails sent, ` +
      `${emailFailedCount} emails failed, ` +
      `${whatsappSentCount} WhatsApp sent, ` +
      `${whatsappFailedCount} WhatsApp failed.`
    );

    return {
      createdCount,

      emailSentCount,
      emailFailedCount,
      emailErrors,

      whatsappSentCount,
      whatsappFailedCount,
      whatsappErrors,
    };
  } catch (error) {
    console.error(
      "Deadline notification error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateDeadlineNotifications,
};