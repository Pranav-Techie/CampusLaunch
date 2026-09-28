import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GraduationCap,
  MapPin,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";


function getIcon(type) {
  switch (type?.toLowerCase()) {

    case "internship":
      return BriefcaseBusiness;

    case "hackathon":
      return Trophy;

    case "scholarship":
      return GraduationCap;

    default:
      return Sparkles;
  }
}


function formatDeadline(deadline) {
  if (!deadline) {
    return "No deadline specified";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(deadline));
}


function getDaysLeft(opportunity) {

  if (opportunity?.deadlineInfo?.isExpired) {
    return "Expired";
  }

  if (
    typeof opportunity?.deadlineInfo?.daysLeft ===
    "number"
  ) {

    const days =
      opportunity.deadlineInfo.daysLeft;

    if (days === 0) {
      return "Deadline today";
    }

    if (days === 1) {
      return "1 day left";
    }

    return `${days} days left`;
  }

  if (!opportunity?.deadline) {
    return "No deadline";
  }

  const days = Math.ceil(
    (
      new Date(
        opportunity.deadline
      ).getTime() -
      Date.now()
    ) /
      (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Deadline today";
  }

  return `${days} days left`;
}


/* =====================================================
   DESCRIPTION → READABLE POINTS
   ===================================================== */

function descriptionToPoints(description) {

  if (!description) {
    return [];
  }

  const cleaned = description
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return [];
  }

  const parts = cleaned
    .split(
      /(?<=[.!?])\s+(?=[A-Z0-9])/
    )
    .map((item) =>
      item
        .replace(/^#+\s*/, "")
        .replace(
          /^\d+[\).\s-]+/,
          ""
        )
        .trim()
    )
    .filter(
      (item) =>
        item.length > 15
    );

  return parts;
}


function OpportunityDetails() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [opportunity, setOpportunity] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [tracking, setTracking] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [tracked, setTracked] =
    useState(false);

  const [actionMessage, setActionMessage] =
    useState("");


  const loadOpportunity = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await api.get(
        `/opportunities/${id}`
      );

      setOpportunity(
        response.data?.opportunity ||
          response.data
      );

    } catch (err) {

      console.error(
        "Opportunity details error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load this opportunity."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadOpportunity();
  }, [id]);


  const handleSave = async () => {

    try {

      setSaving(true);

      setActionMessage("");

      await api.post(
        "/saved",
        {
          opportunityId: id,
        }
      );

      setSaved(true);

      setActionMessage(
        "Opportunity saved to your CampusLaunch space."
      );

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Unable to save this opportunity.";

      if (
        message
          .toLowerCase()
          .includes("already")
      ) {

        setSaved(true);

        setActionMessage(
          "This opportunity is already saved."
        );

      } else {

        setActionMessage(message);

      }

    } finally {

      setSaving(false);

    }
  };


  const handleTrack = async () => {

    try {

      setTracking(true);

      setActionMessage("");

      await api.post(
        "/applications",
        {
          opportunityId: id,
        }
      );

      setTracked(true);

      setActionMessage(
        "Added to your application tracker."
      );

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Unable to add this opportunity to your tracker.";

      if (
        message
          .toLowerCase()
          .includes("already")
      ) {

        setTracked(true);

        setActionMessage(
          "This opportunity is already in your tracker."
        );

      } else {

        setActionMessage(message);

      }

    } finally {

      setTracking(false);

    }
  };


  if (loading) {

    return (
      <div className="opportunity-detail-loading">

        <RefreshCw
          size={26}
          className="opportunity-detail-spin"
        />

        <p>
          Loading opportunity details...
        </p>

      </div>
    );
  }


  if (error || !opportunity) {

    return (
      <div className="opportunity-detail-error">

        <div>
          <Sparkles size={22} />
        </div>

        <h1>
          Opportunity unavailable
        </h1>

        <p>
          {error ||
            "This opportunity could not be found."}
        </p>

        <Link
          to="/opportunities"
          className="opportunity-detail-primary"
        >
          <ArrowLeft size={15} />
          Back to opportunities
        </Link>

      </div>
    );
  }


  const Icon = getIcon(
    opportunity.type
  );


  const matchScore =
    opportunity.matchScore ??
    opportunity.matchPercentage;


  return (
    <div className="opportunity-detail-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="opportunity-detail-header">

        <Link
          to="/opportunities"
          className="opportunity-detail-back"
        >

          <ArrowLeft size={15} />

          All opportunities

        </Link>


        <span className="opportunity-detail-brand">
          CampusLaunch
        </span>

      </header>


      <main className="opportunity-detail-main">


        {/* ===================================================
            HERO
            =================================================== */}

        <section className="opportunity-detail-hero">

          <div className="opportunity-detail-icon">

            <Icon size={26} />

          </div>


          <div className="opportunity-detail-heading">

            <span>
              {opportunity.type ||
                "Opportunity"}
            </span>


            <h1>
              {opportunity.title}
            </h1>


            <p>
              {opportunity.organization}
            </p>

          </div>


          {opportunity.verified && (
            <div className="opportunity-detail-verified">

              <Check size={13} />

              Verified

            </div>
          )}

        </section>


        {/* ===================================================
            CONTENT
            =================================================== */}

        <div className="opportunity-detail-layout">

          <div className="opportunity-detail-content">


            {/* =================================================
                SUMMARY
                ================================================= */}

            <section className="opportunity-detail-card">

              <div className="opportunity-detail-section-heading">

                <span>
                  OVERVIEW
                </span>

                <h2>
                  About this opportunity
                </h2>

              </div>


              {opportunity.description ? (

                <ul className="opportunity-detail-points">

                  {descriptionToPoints(
                    opportunity.description
                  ).map(
                    (point, index) => (

                      <li
                        key={`${point}-${index}`}
                      >
                        {point}
                      </li>

                    )
                  )}

                </ul>

              ) : (

                <p className="opportunity-detail-description">
                  No description provided.
                </p>

              )}

            </section>


            {/* =================================================
                ELIGIBILITY
                ================================================= */}

            <section className="opportunity-detail-card">

              <div className="opportunity-detail-section-heading">

                <span>
                  ELIGIBILITY
                </span>

                <h2>
                  Who can apply?
                </h2>

              </div>


              <p className="opportunity-detail-description">

                {opportunity.eligibility ||
                  "Eligibility information has not been provided."}

              </p>

            </section>


            {/* =================================================
                SKILLS
                ================================================= */}

            {Array.isArray(
              opportunity.skills
            ) &&
              opportunity.skills.length > 0 && (

                <section className="opportunity-detail-card">

                  <div className="opportunity-detail-section-heading">

                    <span>
                      SKILLS
                    </span>

                    <h2>
                      Skills & requirements
                    </h2>

                  </div>


                  <div className="opportunity-detail-skills">

                    {opportunity.skills.map(
                      (skill) => (

                        <span key={skill}>
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </section>

              )}


            {/* =================================================
                SOURCE
                ================================================= */}

            <section className="opportunity-detail-card">

              <div className="opportunity-detail-section-heading">

                <span>
                  SOURCE
                </span>

                <h2>
                  Opportunity source
                </h2>

              </div>


              <div className="opportunity-detail-source">

                <CheckCircle2 size={17} />

                <div>

                  <strong>
                    {opportunity.source ||
                      "CampusLaunch"}
                  </strong>

                  <span>
                    Always verify final
                    application requirements
                    on the official source.
                  </span>

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              SIDEBAR
              ================================================= */}

          <aside className="opportunity-detail-sidebar">


            {/* DEADLINE */}

            <section className="opportunity-detail-side-card deadline">

              <div className="opportunity-detail-side-icon">

                <CalendarClock size={18} />

              </div>


              <span>
                APPLICATION DEADLINE
              </span>


              <strong>

                {formatDeadline(
                  opportunity.deadline
                )}

              </strong>


              <div className="opportunity-detail-days">

                <Clock3 size={13} />

                {getDaysLeft(
                  opportunity
                )}

              </div>

            </section>


            {/* MATCH */}

            {typeof matchScore ===
              "number" && (

              <section className="opportunity-detail-side-card match">

                <div className="opportunity-detail-side-icon">

                  <Sparkles size={18} />

                </div>


                <span>
                  YOUR MATCH
                </span>


                <strong>
                  {matchScore}%
                </strong>


                <p>
                  Based on your current
                  CampusLaunch profile.
                </p>

              </section>

            )}


            {/* DETAILS */}

            <section className="opportunity-detail-side-card">

              <span className="side-card-label">
                OPPORTUNITY DETAILS
              </span>


              {opportunity.location && (

                <div className="detail-info-row">

                  <MapPin size={15} />

                  <div>

                    <small>
                      Location
                    </small>

                    <strong>
                      {opportunity.location}
                    </strong>

                  </div>

                </div>

              )}


              {opportunity.mode && (

                <div className="detail-info-row">

                  <BriefcaseBusiness
                    size={15}
                  />

                  <div>

                    <small>
                      Mode
                    </small>

                    <strong>
                      {opportunity.mode}
                    </strong>

                  </div>

                </div>

              )}


              {opportunity.stipend && (

                <div className="detail-info-row">

                  <Sparkles size={15} />

                  <div>

                    <small>
                      Compensation
                    </small>

                    <strong>
                      {opportunity.stipend}
                    </strong>

                  </div>

                </div>

              )}

            </section>


            {/* =================================================
                ACTIONS
                ================================================= */}

            <section className="opportunity-detail-actions">


              <a
                href={
                  opportunity.applicationUrl
                }
                target="_blank"
                rel="noreferrer"
                className="opportunity-detail-primary"
                onClick={() => {

                  setActionMessage(
                    "Opening the official application source..."
                  );

                }}
              >

                Apply now

                <ExternalLink size={14} />

              </a>


              <button
                type="button"
                className={`opportunity-detail-secondary ${
                  saved ? "active" : ""
                }`}
                onClick={handleSave}
                disabled={saving}
              >

                <Bookmark
                  size={15}
                  fill={
                    saved
                      ? "currentColor"
                      : "none"
                  }
                />


                {saving
                  ? "Saving..."
                  : saved
                  ? "Saved"
                  : "Save opportunity"}

              </button>


              <button
                type="button"
                className={`opportunity-detail-secondary ${
                  tracked ? "active" : ""
                }`}
                onClick={handleTrack}
                disabled={tracking}
              >

                {tracked ? (
                  <Check size={15} />
                ) : (
                  <BriefcaseBusiness
                    size={15}
                  />
                )}


                {tracking
                  ? "Adding..."
                  : tracked
                  ? "In tracker"
                  : "Add to tracker"}

              </button>


              {actionMessage && (

                <div className="opportunity-detail-message">

                  {actionMessage}

                </div>

              )}

            </section>

          </aside>

        </div>


        {/* ===================================================
            FOOTER
            =================================================== */}

        <footer className="opportunity-detail-footer">

          <Link to="/opportunities">

            <ArrowLeft size={14} />

            Continue discovering

          </Link>


          <span>

            CampusLaunch • Discover. Match.
            Track. Act.

          </span>

        </footer>

      </main>

    </div>
  );
}

export default OpportunityDetails;