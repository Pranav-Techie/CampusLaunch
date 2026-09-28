import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ExternalLink,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/my");

      setApplications(
        response.data?.applications || []
      );
    } catch (err) {
      console.error("Tracker error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your application tracker."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      const response = await api.patch(
        `/applications/${applicationId}`,
        { status }
      );

      const updatedApplication =
        response.data?.application;

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? updatedApplication || {
                ...application,
                status,
              }
            : application
        )
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="tracker-page tracker-state">
        <RefreshCw
          className="tracker-spin"
          size={24}
        />

        <p>
          Loading your tracker...
        </p>
      </div>
    );
  }

  return (
    <div className="tracker-page">
      <div className="tracker-shell">

        {/* =====================================================
            HEADER
            ===================================================== */}

        <header className="tracker-header">

          <Link
            to="/dashboard"
            className="tracker-back"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>

          <span className="tracker-brand">
            CampusLaunch
          </span>

        </header>


        {/* =====================================================
            HERO
            ===================================================== */}

        <section className="tracker-hero">

          <span className="tracker-eyebrow">
            YOUR PROGRESS
          </span>

          <h1>
            Application tracker
          </h1>

          <p>
            Keep every opportunity you are
            interested in, applied to, or
            shortlisted for in one place.
          </p>

        </section>


        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && (
          <div className="tracker-error">
            {error}
          </div>
        )}


        {/* =====================================================
            EMPTY STATE
            ===================================================== */}

        {applications.length === 0 ? (

          <section className="tracker-empty">

            <BriefcaseBusiness
              size={28}
            />

            <h2>
              No opportunities tracked yet
            </h2>

            <p>
              Add an opportunity from Discover
              to start building your
              application journey.
            </p>

            <Link
              to="/opportunities"
              className="tracker-primary"
            >
              Discover opportunities
            </Link>

          </section>

        ) : (

          /* =====================================================
             APPLICATION LIST
             ===================================================== */

          <section className="tracker-list">

            {applications.map(
              (application) => {

                const opportunity =
                  application.opportunity;

                if (!opportunity) {
                  return null;
                }

                return (
                  <article
                    className="application-card"
                    key={application._id}
                  >

                    {/* =================================================
                        APPLICATION MAIN CONTENT
                        ================================================= */}

                    <div className="application-main">

                      <div className="tracker-card-icon">

                        <BriefcaseBusiness
                          size={20}
                        />

                      </div>


                      <div className="application-info">

                        <span className="tracker-type">
                          {opportunity.type ||
                            "Opportunity"}
                        </span>

                        <h2>
                          {opportunity.title}
                        </h2>

                        <p>
                          {opportunity.organization}
                        </p>


                        {/* META */}

                        <div className="tracker-meta">

                          <span>
                            <CalendarDays
                              size={14}
                            />

                            Deadline:{" "}
                            {formatDate(
                              opportunity.deadline
                            )}
                          </span>


                          {application.appliedAt && (
                            <span>
                              <CheckCircle2
                                size={14}
                              />

                              Applied:{" "}
                              {formatDate(
                                application.appliedAt
                              )}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        STATUS + ACTIONS
                        ================================================= */}

                    <div className="application-status-panel">

                      <select
                        value={
                          application.status
                        }
                        disabled={
                          updatingId ===
                          application._id
                        }
                        onChange={(event) =>
                          updateStatus(
                            application._id,
                            event.target.value
                          )
                        }
                      >

                        <option value="Interested">
                          Interested
                        </option>

                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Shortlisted">
                          Shortlisted
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>

                      </select>


                      {opportunity.applicationUrl && (
                        <a
                          href={
                            opportunity.applicationUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="tracker-apply"
                        >
                          Apply externally

                          <ExternalLink
                            size={14}
                          />
                        </a>
                      )}


                      <Link
                        to={`/opportunities/${opportunity._id}`}
                        className="tracker-view"
                      >
                        View opportunity
                      </Link>

                    </div>

                  </article>
                );
              }
            )}

          </section>

        )}

      </div>
    </div>
  );
}

export default ApplicationTracker;