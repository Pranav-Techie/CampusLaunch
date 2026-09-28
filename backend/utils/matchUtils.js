// ==========================================
// CALCULATE OPPORTUNITY MATCH SCORE
// ==========================================

const calculateMatchScore = (student, opportunity) => {
  let score = 0;

  const studentSkills = (student.skills || []).map(
    (skill) => skill.toLowerCase()
  );

  const studentInterests = (
    student.interests || []
  ).map((interest) => interest.toLowerCase());

  const opportunitySkills = (
    opportunity.skills || []
  ).map((skill) => skill.toLowerCase());

  const opportunityType =
    opportunity.type?.toLowerCase() || "";

  // ------------------------------------------
  // SKILL MATCH — 50 POINTS
  // ------------------------------------------

  if (opportunitySkills.length > 0) {
    const matchedSkills = opportunitySkills.filter(
      (skill) =>
        studentSkills.includes(skill)
    );

    const skillScore =
      (matchedSkills.length /
        opportunitySkills.length) *
      50;

    score += skillScore;
  }

  // ------------------------------------------
  // INTEREST MATCH — 30 POINTS
  // ------------------------------------------

  const interestMatch =
    studentInterests.includes(opportunityType);

  if (interestMatch) {
    score += 30;
  }

  // ------------------------------------------
  // COURSE / STUDENT RELEVANCE — 20 POINTS
  // ------------------------------------------

  const course =
    student.course?.toLowerCase() || "";

  const description =
    opportunity.description?.toLowerCase() || "";

  const eligibility =
    opportunity.eligibility?.toLowerCase() || "";

  const combinedText =
    `${description} ${eligibility}`;

  if (
    course.includes("computer") ||
    course.includes("cse") ||
    course.includes("software")
  ) {
    if (
      combinedText.includes("computer") ||
      combinedText.includes("software") ||
      combinedText.includes("engineering")
    ) {
      score += 20;
    }
  }

  // ------------------------------------------
  // FINAL SCORE
  // ------------------------------------------

  score = Math.round(
    Math.min(score, 100)
  );

  return score;
};


// ==========================================
// MATCH LABEL
// ==========================================

const getMatchLabel = (score) => {
  if (score >= 80) {
    return "Excellent Match";
  }

  if (score >= 60) {
    return "Strong Match";
  }

  if (score >= 40) {
    return "Good Match";
  }

  return "Low Match";
};


module.exports = {
  calculateMatchScore,
  getMatchLabel,
};