const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendDeadlineEmail = async ({
  to,
  name,
  opportunity,
  daysLeft,
  deadline,
}) => {
  if (!to) {
    throw new Error("Recipient email is required.");
  }

  const formattedDeadline = new Date(
    deadline
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { data, error } =
    await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "onboarding@resend.dev",

      to: [to],

      subject:
        daysLeft === 1
          ? `⚠️ Deadline tomorrow: ${opportunity.title}`
          : `CampusLaunch deadline reminder: ${opportunity.title}`,

      html: `
        <!DOCTYPE html>
        <html>
          <body style="
            margin: 0;
            padding: 0;
            background: #f5f7fb;
            font-family: Arial, sans-serif;
          ">

            <div style="
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              padding: 32px;
              box-shadow: 0 8px 30px rgba(0,0,0,0.06);
            ">

              <div style="
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 1px;
                color: #6366f1;
                margin-bottom: 12px;
              ">
                CAMPUSLAUNCH
              </div>

              <h1 style="
                margin: 0 0 16px;
                font-size: 26px;
                color: #111827;
              ">
                Deadline reminder
              </h1>

              <p style="
                color: #4b5563;
                font-size: 15px;
                line-height: 1.6;
              ">
                Hi ${name || "there"},
              </p>

              <p style="
                color: #4b5563;
                font-size: 15px;
                line-height: 1.6;
              ">
                Your tracked opportunity has an
                upcoming deadline.
              </p>

              <div style="
                margin: 24px 0;
                padding: 20px;
                background: #f8fafc;
                border-radius: 12px;
              ">

                <h2 style="
                  margin: 0 0 8px;
                  color: #111827;
                  font-size: 20px;
                ">
                  ${opportunity.title}
                </h2>

                <p style="
                  margin: 4px 0;
                  color: #6b7280;
                ">
                  ${opportunity.organization || ""}
                </p>

                <p style="
                  margin: 14px 0 0;
                  color: #dc2626;
                  font-weight: 700;
                ">
                  Deadline: ${formattedDeadline}
                </p>

                <p style="
                  margin: 6px 0 0;
                  color: #6b7280;
                ">
                  ${daysLeft === 1
                    ? "Only 1 day remaining."
                    : `${daysLeft} days remaining.`}
                </p>

              </div>

              ${
                opportunity.applicationUrl
                  ? `
                    <a
                      href="${opportunity.applicationUrl}"
                      style="
                        display: inline-block;
                        padding: 12px 20px;
                        background: #111827;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                      "
                    >
                      Apply now
                    </a>
                  `
                  : ""
              }

              <p style="
                margin-top: 32px;
                color: #9ca3af;
                font-size: 12px;
              ">
                You received this email because
                you are tracking this opportunity
                on CampusLaunch.
              </p>

            </div>

          </body>
        </html>
      `,
    });

  if (error) {
    console.error(
      "Resend email error:",
      error
    );

    throw error;
  }

  return data;
};

module.exports = {
  sendDeadlineEmail,
};