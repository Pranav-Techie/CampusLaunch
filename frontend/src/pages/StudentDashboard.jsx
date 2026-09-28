import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Compass,
  FileCheck2,
  GraduationCap,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CL"
  );
}

function formatDeadline(deadline) {
  if (!deadline) {
    return "Deadline not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(deadline));
}

function getDaysLeft(opportunity) {
  if (opportunity?.deadlineInfo?.isExpired) {
    return "Expired";
  }

  if (
    typeof opportunity?.deadlineInfo?.daysLeft === "number"
  ) {
    const days = opportunity.deadlineInfo.daysLeft;

    if (days === 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day left";
    }

    return `${days} days left`;
  }

  if (!opportunity?.deadline) {
    return "No deadline";
  }

  const difference =
    new Date(opportunity.deadline).getTime() -
    Date.now();

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Today";
  }

  return `${days} days left`;
}

function getUrgencyClass(opportunity) {
  const urgency =
    opportunity?.deadlineInfo?.urgency;

  if (
    urgency === "URGENT" ||
    urgency === "CRITICAL"
  ) {
    return "urgent";
  }

  return "";
}

function getOpportunityIcon(type) {
  switch (type?.toLowerCase()) {
    case "internship":
      return BriefcaseBusiness;

    case "hackathon":
      return Trophy;

    case "scholarship":
      return GraduationCap;

    case "certification":
      return FileCheck2;

    case "workshop":
      return Sparkles;

    default:
      return Compass;
  }
}

function getOpportunityTypeClass(type) {
  switch (type?.toLowerCase()) {
    case "hackathon":
      return "dashboard-type-purple";

    case "scholarship":
      return "dashboard-type-green";

    default:
      return "dashboard-type-blue";
  }
}

function getApplicationStatusClass(status) {
  switch (status?.toLowerCase()) {
    case "applied":
      return "dashboard-status-blue";

    case "shortlisted":
      return "dashboard-status-purple";

    case "selected":
      return "dashboard-status-success";

    case "rejected":
      return "dashboard-status-danger";

    default:
      return "dashboard-status-neutral";
  }
}

function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [recommendations, setRecommendations] =
    useState([]);
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const loadDashboard = async ({
    showFullLoader = true,
  } = {}) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const [
        dashboardResponse,
        recommendationResponse,
        notificationResponse,
      ] = await Promise.all([
        api.get("/dashboard/student"),
        api.get("/opportunities/recommended"),
        api.get("/notifications/my"),
      ]);

      setDashboard(
        dashboardResponse.data || null
      );

      setRecommendations(
        recommendationResponse.data
          ?.opportunities ||
          recommendationResponse.data
            ?.recommendedOpportunities ||
          recommendationResponse.data
            ?.recommendations ||
          []
      );

      setNotifications(
        notificationResponse.data
          ?.notifications || []
      );
    } catch (err) {
      console.error(
        "Student dashboard error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        logout();
        navigate("/login", {
          replace: true,
        });

        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your CampusLaunch dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const student =
    dashboard?.student || user || {};

  const stats = dashboard?.stats || {};

  const upcomingDeadlines =
    dashboard?.upcomingDeadlines || [];

  const applications =
    dashboard?.applications || [];

  const savedOpportunities =
    dashboard?.savedOpportunities || [];

  const unreadNotifications =
    notifications.filter(
      (notification) => !notification.read
    ).length;

  const applicationCount =
    stats.totalApplications ??
    applications.length ??
    0;

  const savedCount =
    stats.totalSaved ??
    savedOpportunities.length ??
    0;

  const shortlistedCount =
    stats.shortlistedApplications ??
    applications.filter(
      (application) =>
        application.status ===
        "Shortlisted"
    ).length;

  const deadlineCount =
    stats.upcomingDeadlines ??
    upcomingDeadlines.length;

  const displayRecommendations =
    recommendations.slice(0, 3);

  const displayApplications =
    applications.slice(0, 5);

  const displaySaved =
    savedOpportunities.slice(0, 4);

  const displayDeadlines =
    upcomingDeadlines.slice(0, 5);

  const displayNotifications =
    notifications.slice(0, 4);

  const profileSkills = useMemo(() => {
    if (Array.isArray(student.skills)) {
      return student.skills;
    }

    return [];
  }, [student.skills]);

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const scrollToNotifications = () => {
    document
      .getElementById(
        "dashboard-notifications"
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  if (loading) {
    return (
      <div className="student-dashboard-loading">
        <div className="protected-spinner" />

        <h2>Preparing your dashboard</h2>

        <p>
          Loading your opportunities,
          applications and deadlines...
        </p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`student-sidebar ${
          sidebarOpen
            ? "student-sidebar-open"
            : ""
        }`}
      >
        <div className="student-sidebar-top">
          <Link
            to="/dashboard"
            className="dashboard-brand"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <span className="dashboard-brand-mark">
              CL
            </span>

            CampusLaunch
          </Link>

          <button
            type="button"
            className="dashboard-mobile-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile */}

        <div className="dashboard-sidebar-profile">
          <div className="dashboard-profile-avatar">
            {getInitials(student.name)}
          </div>

          <div>
            <strong>
              {student.name || "Student"}
            </strong>

            <span>
              {student.course ||
                "Student account"}
            </span>
          </div>
        </div>

        {/* Navigation */}

        <nav className="dashboard-nav">
          <span className="dashboard-nav-label">
            WORKSPACE
          </span>

          <Link
            to="/dashboard"
            className="dashboard-nav-item active"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Compass size={17} />
            Dashboard
          </Link>

          <Link
            to="/opportunities"
            className="dashboard-nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Search size={17} />
            Discover
          </Link>

          <Link
            to="/applications"
            className="dashboard-nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <BriefcaseBusiness size={17} />
            Applications

            {applicationCount > 0 && (
              <span className="dashboard-nav-count">
                {applicationCount}
              </span>
            )}
          </Link>

          <Link
            to="/saved"
            className="dashboard-nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <Bookmark size={17} />
            Saved

            {savedCount > 0 && (
              <span className="dashboard-nav-count">
                {savedCount}
              </span>
            )}
          </Link>

          <span className="dashboard-nav-label second">
            ACCOUNT
          </span>

          <button
            type="button"
            className="dashboard-nav-item"
            onClick={scrollToNotifications}
          >
            <Bell size={17} />
            Notifications

            {unreadNotifications > 0 && (
              <span className="dashboard-nav-count">
                {unreadNotifications}
              </span>
            )}
          </button>

          <Link
            to="/profile"
            className="dashboard-nav-item"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <CircleUserRound size={17} />
            Profile
          </Link>
        </nav>

        {/* Logout */}

        <div className="dashboard-sidebar-bottom">
          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}

      {sidebarOpen && (
        <button
          type="button"
          className="dashboard-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Close navigation"
        />
      )}

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="student-main">
        {/* TOPBAR */}

        <header className="student-topbar">
          <button
            type="button"
            className="dashboard-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>

          <div className="student-topbar-title">
            <span>STUDENT WORKSPACE</span>

            <strong>
              CampusLaunch Dashboard
            </strong>
          </div>

          <div className="student-topbar-actions">
            <button
              type="button"
              className="dashboard-icon-button"
              onClick={
                scrollToNotifications
              }
              aria-label="Notifications"
            >
              <Bell size={18} />

              {unreadNotifications > 0 && (
                <span className="dashboard-notification-dot">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <div className="student-topbar-avatar">
              {getInitials(student.name)}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="student-content">
          {error && (
            <div className="dashboard-error">
              <strong>
                Dashboard connection issue
              </strong>

              <span>{error}</span>

              <button
                type="button"
                className="dashboard-outline-button"
                onClick={() =>
                  loadDashboard({
                    showFullLoader: false,
                  })
                }
              >
                <RefreshCw size={13} />
                Try again
              </button>
            </div>
          )}

          {/* =================================================
              WELCOME
              ================================================= */}

          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-kicker">
                YOUR OPPORTUNITY SPACE
              </span>

              <h1>
                Good day,{" "}
                {student.name
                  ?.split(" ")[0] ||
                  "Student"}{" "}
                👋
              </h1>

              <p>
                Discover opportunities that
                fit your profile, keep your
                applications organized, and
                stay ahead of every deadline.
              </p>
            </div>

            <Link
              to="/opportunities"
              className="dashboard-primary-button"
            >
              Discover opportunities
              <ArrowRight size={16} />
            </Link>
          </section>

          {/* =================================================
              STATS
              ================================================= */}

          <section className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon purple">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <span>APPLICATIONS</span>

                <strong>
                  {applicationCount}
                </strong>

                <small>
                  opportunities tracked
                </small>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon blue">
                <Bookmark size={19} />
              </div>

              <div>
                <span>SAVED</span>

                <strong>
                  {savedCount}
                </strong>

                <small>
                  opportunities saved
                </small>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon green">
                <Target size={19} />
              </div>

              <div>
                <span>SHORTLISTED</span>

                <strong>
                  {shortlistedCount}
                </strong>

                <small>
                  application milestones
                </small>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon orange">
                <CalendarClock size={19} />
              </div>

              <div>
                <span>DEADLINES</span>

                <strong>
                  {deadlineCount}
                </strong>

                <small>
                  upcoming opportunities
                </small>
              </div>
            </div>
          </section>

          {/* =================================================
              RECOMMENDED OPPORTUNITIES
              ================================================= */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <span className="dashboard-section-kicker">
                  PERSONALIZED FOR YOU
                </span>

                <h2>
                  Recommended opportunities
                </h2>

                <p>
                  Based on your skills,
                  interests and academic profile.
                </p>
              </div>

              <Link
                to="/opportunities"
                className="dashboard-text-link"
              >
                View all
                <ChevronRight size={14} />
              </Link>
            </div>

            {displayRecommendations.length >
            0 ? (
              <div className="dashboard-opportunity-grid">
                {displayRecommendations.map(
                  (opportunity) => {
                    const Icon =
                      getOpportunityIcon(
                        opportunity.type
                      );

                    const typeClass =
                      getOpportunityTypeClass(
                        opportunity.type
                      );

                    const matchScore =
                      opportunity.matchScore ??
                      opportunity.matchPercentage;

                    return (
                      <article
                        className="dashboard-opportunity-card"
                        key={opportunity._id}
                      >
                        <div className="dashboard-opportunity-top">
                          <div
                            className={`dashboard-opportunity-icon ${typeClass}`}
                          >
                            <Icon size={18} />
                          </div>

                          {typeof matchScore ===
                            "number" && (
                            <span className="dashboard-match-badge">
                              {matchScore}% match
                            </span>
                          )}
                        </div>

                        <span className="dashboard-opportunity-type">
                          {opportunity.type ||
                            "Opportunity"}
                        </span>

                        <h3>
                          {opportunity.title}
                        </h3>

                        <p className="dashboard-opportunity-org">
                          {opportunity.organization ||
                            "Organization"}
                        </p>

                        <div className="dashboard-opportunity-meta">
                          {opportunity.mode && (
                            <span>
                              {opportunity.mode}
                            </span>
                          )}

                          {opportunity.location && (
                            <span>
                              {opportunity.location}
                            </span>
                          )}

                          {opportunity.stipend && (
                            <span>
                              {opportunity.stipend}
                            </span>
                          )}
                        </div>

                        <div className="dashboard-opportunity-footer">
                          <span>
                            <Clock3
                              size={12}
                              style={{
                                verticalAlign:
                                  "middle",
                                marginRight: 4,
                              }}
                            />

                            {getDaysLeft(
                              opportunity
                            )}
                          </span>

                          <Link
                            to={`/opportunities/${opportunity._id}`}
                            aria-label={`View ${opportunity.title}`}
                          >
                            <ArrowRight
                              size={14}
                            />
                          </Link>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="dashboard-empty">
                <Sparkles size={24} />

                <h3>
                  No recommendations yet
                </h3>

                <p>
                  Add more skills and interests
                  to your profile so CampusLaunch
                  can personalize your opportunity
                  feed.
                </p>

                <Link
                  to="/profile"
                  className="dashboard-primary-button small"
                >
                  Complete profile
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </section>

          {/* =================================================
              DEADLINES + APPLICATIONS
              ================================================= */}

          <section className="dashboard-two-column">
            {/* Deadlines */}

            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <span className="dashboard-section-kicker">
                    DON'T MISS OUT
                  </span>

                  <h2>
                    Upcoming deadlines
                  </h2>
                </div>

                <CalendarClock size={18} />
              </div>

              {displayDeadlines.length >
              0 ? (
                <div className="dashboard-deadline-list">
                  {displayDeadlines.map(
                    (item) => {
                      const opportunity =
                        item.opportunity ||
                        item;

                      return (
                        <div
                          className="dashboard-deadline-item"
                          key={
                            item._id ||
                            opportunity._id
                          }
                        >
                          <div className="dashboard-deadline-icon">
                            <Clock3 size={16} />
                          </div>

                          <div className="dashboard-deadline-content">
                            <strong>
                              {
                                opportunity.title
                              }
                            </strong>

                            <span>
                              {formatDeadline(
                                opportunity.deadline
                              )}
                            </span>
                          </div>

                          <span
                            className={`dashboard-urgency ${getUrgencyClass(
                              opportunity
                            )}`}
                          >
                            {getDaysLeft(
                              opportunity
                            )}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="dashboard-panel-empty">
                  <CheckCircle2 size={21} />

                  <p>
                    No upcoming deadlines
                    require your attention.
                  </p>
                </div>
              )}
            </div>

            {/* Applications */}

            <div className="dashboard-panel">
              <div className="dashboard-panel-header">
                <div>
                  <span className="dashboard-section-kicker">
                    YOUR PROGRESS
                  </span>

                  <h2>
                    Application tracker
                  </h2>
                </div>

                <FileCheck2 size={18} />
              </div>

              {displayApplications.length >
              0 ? (
                <div className="dashboard-application-list">
                  {displayApplications.map(
                    (application) => (
                      <div
                        className="dashboard-application-item"
                        key={
                          application._id
                        }
                      >
                        <div>
                          <strong>
                            {application
                              .opportunity
                              ?.title ||
                              "Opportunity"}
                          </strong>

                          <span>
                            {application
                              .opportunity
                              ?.organization ||
                              "Organization"}
                          </span>
                        </div>

                        <span
                          className={`dashboard-status ${getApplicationStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status ||
                            "Interested"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="dashboard-panel-empty">
                  <BriefcaseBusiness
                    size={21}
                  />

                  <p>
                    You haven't added any
                    opportunities to your
                    application tracker yet.
                  </p>
                </div>
              )}

              {displayApplications.length >
                0 && (
                <Link
                  to="/applications"
                  className="dashboard-primary-button small"
                >
                  Open tracker
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </section>

          {/* =================================================
              SAVED OPPORTUNITIES
              ================================================= */}

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <span className="dashboard-section-kicker">
                  BOOKMARKED
                </span>

                <h2>
                  Saved opportunities
                </h2>

                <p>
                  Opportunities you want to
                  revisit later.
                </p>
              </div>

              <Link
                to="/saved"
                className="dashboard-text-link"
              >
                View saved
                <ChevronRight size={14} />
              </Link>
            </div>

            {displaySaved.length > 0 ? (
              <div className="dashboard-panel">
                <div className="dashboard-saved-list">
                  {displaySaved.map(
                    (item) => {
                      const opportunity =
                        item.opportunity ||
                        item;

                      return (
                        <div
                          className="dashboard-saved-item"
                          key={
                            item._id ||
                            opportunity._id
                          }
                        >
                          <div className="dashboard-saved-icon">
                            <Bookmark
                              size={16}
                            />
                          </div>

                          <div>
                            <strong>
                              {
                                opportunity.title
                              }
                            </strong>

                            <span>
                              {
                                opportunity.organization
                              }{" "}
                              •{" "}
                              {
                                opportunity.type
                              }
                            </span>
                          </div>

                          <Link
                            to={`/opportunities/${opportunity._id}`}
                            aria-label={`View ${opportunity.title}`}
                          >
                            <ArrowRight
                              size={14}
                            />
                          </Link>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <div className="dashboard-empty compact">
                <Bookmark size={17} />

                <span>
                  You haven't saved any
                  opportunities yet.
                </span>
              </div>
            )}
          </section>

          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <section
            className="dashboard-section"
            id="dashboard-notifications"
          >
            <div className="dashboard-section-header">
              <div>
                <span className="dashboard-section-kicker">
                  STAY INFORMED
                </span>

                <h2>
                  Recent notifications
                </h2>

                <p>
                  Important updates and deadline
                  reminders from CampusLaunch.
                </p>
              </div>

              <Bell size={18} />
            </div>

            {displayNotifications.length >
            0 ? (
              <div className="dashboard-panel">
                <div className="dashboard-notification-list">
                  {displayNotifications.map(
                    (notification) => (
                      <div
                        className={`dashboard-notification ${
                          !notification.read
                            ? "unread"
                            : ""
                        }`}
                        key={
                          notification._id
                        }
                      >
                        <div className="dashboard-notification-icon">
                          <Bell size={15} />
                        </div>

                        <div>
                          <strong>
                            {notification.title ||
                              "CampusLaunch notification"}
                          </strong>

                          <p>
                            {
                              notification.message
                            }
                          </p>
                        </div>

                        {!notification.read && (
                          <span className="dashboard-unread-dot" />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="dashboard-empty compact">
                <CheckCircle2 size={17} />

                <span>
                  You're all caught up.
                </span>
              </div>
            )}
          </section>

          {/* =================================================
              PROFILE SNAPSHOT
              ================================================= */}

          <section className="dashboard-section">
            <div className="dashboard-profile-panel">
              <div className="dashboard-profile-heading">
                <div className="dashboard-profile-large-avatar">
                  {getInitials(
                    student.name
                  )}
                </div>

                <div>
                  <h2>
                    {student.name ||
                      "Student"}
                  </h2>

                  <p>
                    {student.course ||
                      "Undergraduate student"}
                    {student.year
                      ? ` • Year ${student.year}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="dashboard-profile-skills">
                {profileSkills.length > 0 ? (
                  profileSkills
                    .slice(0, 8)
                    .map((skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    ))
                ) : (
                  <span>
                    Add skills to improve
                    recommendations
                  </span>
                )}
              </div>

              <Link
                to="/profile"
                className="dashboard-outline-button"
              >
                <CircleUserRound
                  size={13}
                />
                Edit profile
              </Link>
            </div>
          </section>

          {/* FOOTER */}

          <footer className="dashboard-footer">
            <span>
              CampusLaunch • Opportunity
              intelligence for students
            </span>

            <span>
              {refreshing
                ? "Refreshing..."
                : "Data synced with your account"}
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;