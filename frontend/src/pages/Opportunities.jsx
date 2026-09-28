import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import api from "../services/api";

// =====================================================
// DATE
// =====================================================

function formatDate(date) {
  if (!date) return "—";

  return new Date(
    date
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// =====================================================
// OPPORTUNITIES
// =====================================================

function Opportunities() {
  const [
    opportunities,
    setOpportunities,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    type,
    setType,
  ] = useState("");

  const [
    mode,
    setMode,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("Open");

  const [
    sort,
    setSort,
  ] = useState("deadline");

  // ===================================================
  // LOAD OPPORTUNITIES
  // ===================================================

  const loadOpportunities =
    async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search.trim()) {
          params.search =
            search.trim();
        }

        if (type) {
          params.type = type;
        }

        if (mode) {
          params.mode = mode;
        }

        if (status) {
          params.status = status;
        }

        if (sort) {
          params.sort = sort;
        }

        const response =
          await api.get(
            "/opportunities",
            {
              params,
            }
          );

        setOpportunities(
          response.data
            ?.opportunities || []
        );
      } catch (err) {
        console.error(
          "Failed to load opportunities:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Failed to load opportunities"
        );

        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

  // ===================================================
  // INITIAL / FILTER LOAD
  // ===================================================

  useEffect(() => {
    loadOpportunities();
  }, [
    type,
    mode,
    status,
    sort,
  ]);

  // ===================================================
  // SEARCH
  // ===================================================

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();

    loadOpportunities();
  };

  // ===================================================
  // CLEAR FILTERS
  // ===================================================

  const clearFilters = () => {
    setSearch("");
    setType("");
    setMode("");
    setStatus("Open");
    setSort("deadline");
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="opportunities-page">
      <div className="opportunities-shell">

        {/* =========================================
            HERO
        ========================================= */}

        <section className="opportunities-hero">
          <div>
            <span className="opportunities-eyebrow">
              CAMPUSLAUNCH
            </span>

            <h1>
              Find your next opportunity
            </h1>

            <p>
              Discover verified
              internships,
              hackathons,
              scholarships,
              workshops and more —
              filtered around what
              matters to you.
            </p>
          </div>

          <div className="opportunities-hero-icon">
            <Sparkles size={24} />
          </div>
        </section>

        {/* =========================================
            FILTERS
        ========================================= */}

        <section className="opportunity-filters">

          <form
            className="opportunity-search"
            onSubmit={
              handleSearchSubmit
            }
          >
            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search opportunities, companies or skills..."
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="opportunity-filter-row">

            {/* TYPE */}

            <div className="opportunity-filter-group">
              <label>
                Type
              </label>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All types
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Hackathon">
                  Hackathon
                </option>

                <option value="Scholarship">
                  Scholarship
                </option>

                <option value="Workshop">
                  Workshop
                </option>

                <option value="Certification">
                  Certification
                </option>

                <option value="Event">
                  Event
                </option>
              </select>
            </div>

            {/* MODE */}

            <div className="opportunity-filter-group">
              <label>
                Mode
              </label>

              <select
                value={mode}
                onChange={(event) =>
                  setMode(
                    event.target.value
                  )
                }
              >
                <option value="">
                  All modes
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="On-site">
                  On-site
                </option>
              </select>
            </div>

            {/* SORT */}

            <div className="opportunity-filter-group">
              <label>
                Sort
              </label>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(
                    event.target.value
                  )
                }
              >
                <option value="recommended">
                  Recommended
                </option>

                <option value="deadline">
                  Deadline
                </option>

                <option value="newest">
                  Newest
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div className="opportunity-filter-group">
              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="Open">
                  Open
                </option>

                <option value="">
                  All
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>
            </div>

            {/* CLEAR */}

            <button
              type="button"
              className="opportunity-clear-button"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>

          </div>
        </section>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="opportunities-error">
            <strong>
              Something went wrong
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={
                loadOpportunities
              }
            >
              Try again
            </button>
          </div>
        )}

        {/* =========================================
            RESULTS
        ========================================= */}

        <section className="opportunities-results">

          <div className="opportunities-results-heading">
            <div>
              <span>
                VERIFIED OPPORTUNITIES
              </span>

              <h2>
                {loading
                  ? "Loading..."
                  : `${opportunities.length} opportunities`}
              </h2>
            </div>

            {!loading && (
              <span className="opportunities-results-note">
                {status
                  ? `${status} opportunities`
                  : "All statuses"}
              </span>
            )}
          </div>

          {/* LOADING */}

          {loading ? (
            <div className="opportunity-grid">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="opportunity-skeleton"
                  >
                    <div className="skeleton-icon" />

                    <div className="skeleton-line medium" />

                    <div className="skeleton-line short" />

                    <div className="skeleton-meta" />

                    <div className="skeleton-footer" />
                  </div>
                )
              )}

            </div>
          ) : opportunities.length ===
            0 ? (

            /* EMPTY */

            <div className="opportunities-empty">

              <Search size={24} />

              <h3>
                No opportunities found
              </h3>

              <p>
                Try changing your
                search or filters.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
              >
                Reset filters
              </button>

            </div>

          ) : (

            /* RESULTS */

            <div className="opportunity-grid">

              {opportunities.map(
                (opportunity) => (
                  <article
                    className="opportunity-card"
                    key={
                      opportunity._id
                    }
                  >

                    <div className="opportunity-card-top">

                      <span className="opportunity-type-badge">
                        {
                          opportunity.type
                        }
                      </span>

                      <span className="opportunity-verified-badge">
                        Verified
                      </span>

                    </div>

                    <h3>
                      {
                        opportunity.title
                      }
                    </h3>

                    <p className="opportunity-organization">
                      {
                        opportunity.organization
                      }
                    </p>

                    <p className="opportunity-description">
                      {(
                        opportunity.description ||
                        ""
                      ).slice(
                        0,
                        150
                      )}

                      {(
                        opportunity.description ||
                        ""
                      ).length >
                        150
                        ? "..."
                        : ""}
                    </p>

                    <div className="opportunity-meta">

                      <span>
                        <CalendarDays
                          size={14}
                        />

                        {formatDate(
                          opportunity.deadline
                        )}
                      </span>

                      <span>
                        <MapPin
                          size={14}
                        />

                        {opportunity.mode ||
                          opportunity.location ||
                          "Remote"}
                      </span>

                    </div>

                    {Array.isArray(
                      opportunity.skills
                    ) &&
                      opportunity
                        .skills.length >
                        0 && (
                        <div className="opportunity-skills">

                          {opportunity.skills
                            .slice(
                              0,
                              4
                            )
                            .map(
                              (skill) => (
                                <span
                                  key={
                                    skill
                                  }
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}

                        </div>
                      )}

                    <div className="opportunity-card-footer">

                      <span className="opportunity-deadline-text">

                        {opportunity
                          .deadlineInfo
                          ?.daysLeft !==
                        undefined
                          ? `${
                              opportunity
                                .deadlineInfo
                                .daysLeft
                            } days left`
                          : "Deadline approaching"}

                      </span>

                      <Link
                        to={`/opportunities/${opportunity._id}`}
                        className="opportunity-view-button"
                      >
                        View

                        <ArrowRight
                          size={15}
                        />
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        </section>
      </div>
    </div>
  );
}

export default Opportunities;