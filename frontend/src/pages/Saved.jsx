import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";

function formatDate(date) {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDaysLeft(deadline) {
  if (!deadline) return "";

  const difference =
    new Date(deadline).getTime() - Date.now();

  if (difference <= 0) return "Deadline passed";

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  return days === 1
    ? "1 day left"
    : `${days} days left`;
}

function Saved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSaved = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/saved/my");

      setSaved(response.data.savedOpportunities || []);
    } catch (err) {
      console.error("Failed to load saved opportunities:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load saved opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return (
    <div className="saved-page">
      <header className="saved-header">
        <div>
          <Link
            to="/dashboard"
            className="saved-back-link"
          >
            ← Dashboard
          </Link>

          <div className="saved-kicker">
            SAVED OPPORTUNITIES
          </div>

          <h1>Your opportunity shortlist.</h1>

          <p>
            Keep the opportunities you want to come back
            to close at hand.
          </p>
        </div>

        <button
          className="saved-refresh-button"
          onClick={loadSaved}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={loading ? "saved-spin" : ""}
          />
          Refresh
        </button>
      </header>

      {error && (
        <div className="saved-error">
          {error}
        </div>
      )}

      <main className="saved-content">
        <div className="saved-heading-row">
          <div>
            <span>YOUR SHORTLIST</span>
            <h2>
              {saved.length}{" "}
              {saved.length === 1
                ? "opportunity"
                : "opportunities"}
            </h2>
          </div>

          <Link
            to="/opportunities"
            className="saved-discover-link"
          >
            Discover more
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="saved-empty">
            <div className="saved-loader" />
            <p>Loading saved opportunities...</p>
          </div>
        ) : saved.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-icon">
              <Bookmark size={24} />
            </div>

            <h3>Your shortlist is empty</h3>

            <p>
              Save an opportunity from Discover and it
              will appear here.
            </p>

            <Link
              to="/opportunities"
              className="saved-primary-button"
            >
              Explore opportunities
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="saved-grid">
            {saved.map((item) => {
              const opportunity = item.opportunity;

              if (!opportunity) return null;

              return (
                <article
                  className="saved-card"
                  key={item._id}
                >
                  <div className="saved-card-top">
                    <div className="saved-opportunity-icon">
                      <BriefcaseBusiness size={21} />
                    </div>

                    <span className="saved-type">
                      {opportunity.type ||
                        "Opportunity"}
                    </span>

                    <Bookmark
                      size={18}
                      fill="currentColor"
                    />
                  </div>

                  <h3>{opportunity.title}</h3>

                  <p className="saved-company">
                    {opportunity.organization}
                  </p>

                  <p className="saved-description">
                    {opportunity.description ||
                      "Explore this opportunity and see whether it fits your goals."}
                  </p>

                  <div className="saved-meta">
                    <span>
                      {opportunity.mode ||
                        "Flexible"}
                    </span>

                    <span>
                      {opportunity.location ||
                        "Location not specified"}
                    </span>

                    <span>
                      <CalendarDays size={14} />
                      {formatDate(
                        opportunity.deadline
                      )}
                    </span>
                  </div>

                  <div className="saved-deadline">
                    {getDaysLeft(opportunity.deadline)}
                  </div>

                  <div className="saved-actions">
                    <Link
                      to={`/opportunities/${opportunity._id}`}
                      className="saved-view-button"
                    >
                      View details
                      <ArrowRight size={15} />
                    </Link>

                    {opportunity.applicationUrl && (
                      <a
                        href={opportunity.applicationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="saved-apply-button"
                      >
                        Apply
                        <ExternalLink size={14} />
                      </a>
                    )}
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

export default Saved;