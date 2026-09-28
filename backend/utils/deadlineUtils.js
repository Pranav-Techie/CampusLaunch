const getDeadlineInfo = (deadline) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);

  const difference = deadlineDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {
      daysLeft: 0,
      hoursLeft: 0,
      urgency: "EXPIRED",
      isExpired: true,
    };
  }

  const totalHours = Math.ceil(
    difference / (1000 * 60 * 60)
  );

  const daysLeft = Math.floor(
    totalHours / 24
  );

  const hoursLeft = totalHours % 24;

  let urgency = "NORMAL";

  if (daysLeft <= 1) {
    urgency = "CRITICAL";
  } else if (daysLeft <= 3) {
    urgency = "URGENT";
  } else if (daysLeft <= 7) {
    urgency = "UPCOMING";
  }

  return {
    daysLeft,
    hoursLeft,
    urgency,
    isExpired: false,
  };
};

module.exports = {
  getDeadlineInfo,
};