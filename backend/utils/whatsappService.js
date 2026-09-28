const axios = require("axios");

const sendWhatsAppMessage = async ({
  to,
  name,
  opportunity,
  daysLeft,
}) => {
  const url = `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const response = await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: to.replace(/\D/g, ""),
      type: "template",
      template: {
        name: "campuslaunch_deadline_reminder",
        language: {
          code: "en_US",
        },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: name || "there" },
              { type: "text", text: opportunity.title },
              { type: "text", text: String(daysLeft) },
            ],
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

module.exports = {
  sendWhatsAppMessage,
};