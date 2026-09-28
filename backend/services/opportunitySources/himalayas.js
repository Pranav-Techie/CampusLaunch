const HIMALAYAS_API_URL =
  "https://himalayas.app/jobs/api/search?employment_type=Intern&country=IN&sort=recent&page=1";

/**
 * Convert Himalayas expiryDate into a valid JavaScript Date.
 *
 * Himalayas may provide timestamps in milliseconds, while older/
 * transformed records can sometimes appear as seconds.
 */
function normalizeHimalayasDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  // Already a Date
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  // Numeric timestamp
  if (typeof value === "number") {
    const timestamp =
      value < 100000000000
        ? value * 1000
        : value;

    const date = new Date(timestamp);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Numeric string timestamp
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^\d+$/.test(trimmed)) {
      const numericValue = Number(trimmed);

      const timestamp =
        numericValue < 100000000000
          ? numericValue * 1000
          : numericValue;

      const date = new Date(timestamp);

      return Number.isNaN(date.getTime()) ? null : date;
    }

    // ISO / normal date string
    const date = new Date(trimmed);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatLocation(locationRestrictions) {
  if (!locationRestrictions) {
    return "Remote";
  }

  if (typeof locationRestrictions === "string") {
    return locationRestrictions;
  }

  if (Array.isArray(locationRestrictions)) {
    return locationRestrictions
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item?.name) {
          return item.name;
        }

        if (item?.country) {
          return item.country;
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof locationRestrictions === "object") {
    if (locationRestrictions.name) {
      return locationRestrictions.name;
    }

    if (locationRestrictions.country) {
      return locationRestrictions.country;
    }

    if (Array.isArray(locationRestrictions.countries)) {
      return locationRestrictions.countries.join(", ");
    }
  }

  return "Remote";
}

function detectSkills(job) {
  const text = [
    job.title,
    job.description,
    ...(Array.isArray(job.categories) ? job.categories : []),
    ...(Array.isArray(job.parentCategories) ? job.parentCategories : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const possibleSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "Python",
    "Java",
    "C++",
    "C",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Machine Learning",
    "Artificial Intelligence",
    "Data Science",
    "Data Analytics",
    "Git",
    "GitHub",
    "REST API",
    "FastAPI",
    "Flask",
    "Figma",
  ];

  return possibleSkills.filter((skill) =>
    text.includes(skill.toLowerCase())
  );
}

function normalizeHimalayasOpportunity(job) {
  const deadline = normalizeHimalayasDate(job.expiryDate);

  if (!deadline) {
    return null;
  }

  const description = stripHtml(job.description || "");

  const location = formatLocation(job.locationRestrictions);

  const salary =
    job.salary ||
    job.salaryRange ||
    job.compensation ||
    "";

  const applicationUrl =
    job.applicationLink ||
    job.applicationUrl ||
    "";

  if (!job.guid || !job.title || !job.companyName || !applicationUrl) {
    return null;
  }

  return {
    title: job.title.trim(),

    organization: job.companyName.trim(),

    type: "Internship",

    description,

    eligibility: "",

    skills: detectSkills(job),

    location,

    mode: "Remote",

    stipend:
      typeof salary === "string"
        ? salary.trim()
        : String(salary || ""),

    deadline,

    applicationUrl,

    source: "Himalayas",

    sourceUrl: "https://himalayas.app",

    externalId: String(job.guid),

    sourceType: "api",

    importedAt: new Date(),

    verified: false,

    status: "Open",
  };
}

async function fetchHimalayasOpportunities() {
  const response = await fetch(HIMALAYAS_API_URL);

  if (!response.ok) {
    throw new Error(
      `Himalayas API request failed with status ${response.status}`
    );
  }

  const data = await response.json();

  const jobs = Array.isArray(data)
    ? data
    : data.jobs || data.results || [];

  return jobs
    .map(normalizeHimalayasOpportunity)
    .filter(Boolean);
}

module.exports = {
  HIMALAYAS_API_URL,
  normalizeHimalayasDate,
  normalizeHimalayasOpportunity,
  fetchHimalayasOpportunities,
};