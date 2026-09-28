import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  RefreshCw,
  Search,
  Target,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";

const STATUS_OPTIONS = [
  "Interested",
  "Applied",
  "Shortlisted",
  "Selected",
  "Rejected",
];

function getStatusClass(status) {
  return `application-status ${status
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDeadlineText(opportunity) {
  if (!opportunity?.deadline) return "No deadline";

  const deadline = new Date(opportunity.deadline);
  const now = new Date();

  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) return "Deadline passed";

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 1) return "1 day left";

  return `${days} days left`;
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/applications/my");

      setApplications(response.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      const response = await api.patch(
        `/applications/${applicationId}`,
        {
          status,
        }
      );

      const updatedApplication =
        response.data.application;

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? updatedApplication
            : application
        )
      );
    } catch (err) {
      console.error("Failed to update application:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const total = applications.length;

  const applied = applications.filter(
    (item) => item.status === "Applied"
  ).length;

  const shortlisted = applications.filter(
    (item) => item.status === "Shortlisted"
  ).length;

  const selected = applications.filter(
    (item) => item.status === "Selected"
  ).length;

  return (
    <div className="tracker-page">
      <header className="tracker-header">
        <div>
          <Link
            to="/dashboard"
            className="tracker-back-link"
          >
            ← Dashboard
          </Link>

          <div className="tracker-kicker">
            APPLICATION TRACKER
          </div>

          <h1>Keep every application moving.</h1>

          <p>
            Track where you are with every opportunity
            without losing sight of the next step.
          </p>
        </div>

        <button
          className="tracker-refresh-button"
          onClick={loadApplications}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "tracker-spin" : ""}
          />
          Refresh
        </button>
      </header>

      {error && (
        <div className="tracker-error">
          <XCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <section className="tracker-stats">
        <div className="tracker-stat-card">
          <div className="tracker-stat-icon">
            <Target size={20} />
          </div>

          <span>Total</span>
          <strong>{total}</strong>
        </div>

        <div className="tracker-stat-card">
          <div className="tracker-stat-icon">
            <Clock3 size={20} />
          </div>

          <span>Applied</span>
          <strong>{applied}</strong>
        </div>

        <div className="tracker-stat-card">
          <div className="tracker-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <span>Shortlisted</span>
          <strong>{shortlisted}</strong>
        </div>

        <div className="tracker-stat-card">
          <div className="tracker-stat-icon">
            <BriefcaseBusiness size={20} />
          </div>

          <span>Selected</span>
          <strong>{selected}</strong>
        </div>
      </section>

      <main className="tracker-content">
        <div className="tracker-section-heading">
          <div>
            <span>YOUR APPLICATIONS</span>
            <h2>Application journey</h2>
          </div>

          <Link
            to="/opportunities"
            className="tracker-discover-link"
          >
            Discover more
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="tracker-empty">
            <div className="tracker-loader" />
            <p>Loading your applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="tracker-empty">
            <div className="tracker-empty-icon">
              <Search size={24} />
            </div>

            <h3>No applications yet</h3>

            <p>
              Start tracking an opportunity and it will
              appear here.
            </p>

            <Link
              to="/opportunities"
              className="tracker-primary-button"
            >
              Explore opportunities
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="application-list">
            {applications.map((application) => {
              const opportunity =
                application.opportunity;

              if (!opportunity) return null;

              return (
                <article
                  key={application._id}
                  className="application-card"
                >
                  <div className="application-main">
                    <div className="application-icon">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <div className="application-info">
                      <div className="application-topline">
                        <span>
                          {opportunity.type ||
                            "Opportunity"}
                        </span>

                        <span
                          className={getStatusClass(
                            application.status
                          )}
                        >
                          {application.status}
                        </span>
                      </div>

                      <h3>{opportunity.title}</h3>

                      <p className="application-company">
                        {opportunity.organization}
                      </p>

                      <div className="application-meta">
                        <span>
                          <CalendarDays size={14} />
                          Deadline:{" "}
                          {formatDate(
                            opportunity.deadline
                          )}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {getDeadlineText(
                            opportunity
                          )}
                        </span>

                        <span>
                          {opportunity.mode ||
                            "Flexible"}
                        </span>
                      </div>

                      <div className="application-actions">
                        <Link
                          to={`/opportunities/${opportunity._id}`}
                          className="application-view-button"
                        >
                          View opportunity
                          <ArrowRight size={15} />
                        </Link>

                        {opportunity.applicationUrl && (
                          <a
                            href={
                              opportunity.applicationUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="application-external-button"
                          >
                            Apply
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="application-status-panel">
                    <label htmlFor={application._id}>
                      Status
                    </label>

                    <select
                      id={application._id}
                      value={application.status}
                      disabled={
                        updatingId === application._id
                      }
                      onChange={(event) =>
                        updateStatus(
                          application._id,
                          event.target.value
                        )
                      }
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    <small>
                      {application.appliedAt
                        ? `Applied ${formatDate(
                            application.appliedAt
                          )}`
                        : "Not marked as applied yet"}
                    </small>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;