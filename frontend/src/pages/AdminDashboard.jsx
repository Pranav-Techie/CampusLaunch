import { useEffect, useState } from "react";

import {
  AlertCircle,
  BarChart3,
  Bookmark,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  Edit3,
  ExternalLink,
  FileCheck2,
  FileText,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import "../index.css";


const EMPTY_FORM = {
  title: "",
  organization: "",
  type: "Internship",
  description: "",
  eligibility: "",
  skills: "",
  location: "",
  mode: "Remote",
  stipend: "",
  deadline: "",
  applicationUrl: "",
  source: "Manual",
};


const OPPORTUNITY_TYPES = [
  "Internship",
  "Hackathon",
  "Scholarship",
  "Workshop",
  "Certification",
  "Event",
];


function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


function getDeadlineClass(
  deadlineInfo
) {
  if (!deadlineInfo) return "";

  return String(
    deadlineInfo.urgency || ""
  ).toLowerCase();
}


function formatFileSize(size) {
  if (!size) return "";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}


function AdminDashboard() {
  const { logout } = useAuth();

  const [analytics, setAnalytics] =
    useState(null);

  const [opportunities, setOpportunities] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    applicationsLoading,
    setApplicationsLoading,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  const [syncing, setSyncing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  /*
   * Prevent multiple resume buttons
   * from appearing busy simultaneously.
   */
  const [resumeLoadingId, setResumeLoadingId] =
    useState(null);


  /*
   * =========================================================
   * LOAD ADMIN DATA
   * =========================================================
   */
  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        analyticsResponse,
        opportunitiesResponse,
      ] = await Promise.all([
        api.get("/analytics"),
        api.get(
          "/opportunities/admin/all"
        ),
      ]);

      setAnalytics(
        analyticsResponse.data
      );

      setOpportunities(
        opportunitiesResponse.data
          ?.opportunities || []
      );
    } catch (err) {
      console.error(
        "Admin data error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load admin data"
      );
    } finally {
      setLoading(false);
    }
  };


  /*
   * =========================================================
   * LOAD ALL STUDENT APPLICATIONS
   * =========================================================
   */
  const loadApplications = async () => {
    try {
      setApplicationsLoading(true);

      const response =
        await api.get(
          "/applications/admin/all"
        );

      setApplications(
        response.data?.applications ||
          []
      );
    } catch (err) {
      console.error(
        "Applications error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load applications"
      );
    } finally {
      setApplicationsLoading(
        false
      );
    }
  };


  /*
   * =========================================================
   * LOAD EVERYTHING
   * =========================================================
   */
  const loadAll = async () => {
    await Promise.all([
      loadAdminData(),
      loadApplications(),
    ]);
  };


  useEffect(() => {
    loadAll();
  }, []);


  /*
   * =========================================================
   * FORM CHANGE
   * =========================================================
   */
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /*
   * =========================================================
   * RESET FORM
   * =========================================================
   */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };


  /*
   * =========================================================
   * CREATE OPPORTUNITY
   * =========================================================
   */
  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);

    setError("");
    setSuccess("");
  };


  /*
   * =========================================================
   * EDIT OPPORTUNITY
   * =========================================================
   */
  const openEditForm = (
    opportunity
  ) => {
    setEditingId(
      opportunity._id
    );

    setForm({
      title:
        opportunity.title || "",

      organization:
        opportunity.organization ||
        "",

      type:
        opportunity.type ||
        "Internship",

      description:
        opportunity.description ||
        "",

      eligibility:
        opportunity.eligibility ||
        "",

      skills:
        Array.isArray(
          opportunity.skills
        )
          ? opportunity.skills.join(
              ", "
            )
          : opportunity.skills || "",

      location:
        opportunity.location ||
        "",

      mode:
        opportunity.mode ||
        "Remote",

      stipend:
        opportunity.stipend ||
        "",

      deadline:
        opportunity.deadline
          ? new Date(
              opportunity.deadline
            )
              .toISOString()
              .slice(0, 10)
          : "",

      applicationUrl:
        opportunity.applicationUrl ||
        "",

      source:
        opportunity.source ||
        "Manual",
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };


  /*
   * =========================================================
   * CREATE / UPDATE OPPORTUNITY
   * =========================================================
   */
  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        ...form,

        skills: form.skills
          .split(",")
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(
          `/opportunities/${editingId}`,
          payload
        );

        setSuccess(
          "Opportunity updated successfully."
        );
      } else {
        await api.post(
          "/opportunities",
          payload
        );

        setSuccess(
          "Opportunity created successfully."
        );
      }

      resetForm();

      await loadAdminData();
    } catch (err) {
      console.error(
        "Save opportunity error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save opportunity"
      );
    } finally {
      setSaving(false);
    }
  };


  /*
   * =========================================================
   * VERIFY OPPORTUNITY
   * =========================================================
   */
  const verifyOpportunity =
    async (id) => {
      try {
        setError("");
        setSuccess("");

        await api.patch(
          `/opportunities/${id}/verify`
        );

        setSuccess(
          "Opportunity verified successfully."
        );

        await loadAdminData();
      } catch (err) {
        console.error(
          "Verify opportunity error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to verify opportunity"
        );
      }
    };


  /*
   * =========================================================
   * DELETE OPPORTUNITY
   * =========================================================
   */
  const deleteOpportunity =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this opportunity permanently?"
        );

      if (!confirmed) return;

      try {
        setError("");
        setSuccess("");

        await api.delete(
          `/opportunities/${id}`
        );

        setSuccess(
          "Opportunity deleted successfully."
        );

        await loadAdminData();
      } catch (err) {
        console.error(
          "Delete opportunity error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to delete opportunity"
        );
      }
    };


  /*
   * =========================================================
   * SYNC HIMALAYAS
   * =========================================================
   */
  const syncHimalayas =
    async () => {
      try {
        setSyncing(true);
        setError("");
        setSuccess("");

        const response =
          await api.post(
            "/opportunities/sync/himalayas"
          );

        const result =
          response.data || {};

        setSuccess(
          `Himalayas sync complete — ${
            result.created || 0
          } created, ${
            result.updated || 0
          } updated, ${
            result.skipped || 0
          } skipped.`
        );

        await loadAdminData();
      } catch (err) {
        console.error(
          "Himalayas sync error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Himalayas sync failed"
        );
      } finally {
        setSyncing(false);
      }
    };


  /*
   * =========================================================
   * ADMIN — VIEW STUDENT RESUME
   * =========================================================
   */
  const viewStudentResume =
    async (studentId) => {
      if (!studentId) {
        setError(
          "Student information is unavailable."
        );

        return;
      }

      try {
        setResumeLoadingId(
          studentId
        );

        setError("");

        const response =
          await api.get(
            `/auth/admin/students/${studentId}/resume`,
            {
              responseType: "blob",
            }
          );

        const blob =
          new Blob(
            [response.data],
            {
              type:
                response.headers[
                  "content-type"
                ] ||
                "application/pdf",
            }
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );

        /*
         * Give the browser time to open
         * the PDF before releasing the URL.
         */
        setTimeout(() => {
          window.URL.revokeObjectURL(
            url
          );
        }, 60000);
      } catch (err) {
        console.error(
          "View student resume error:",
          err
        );

        /*
         * Axios may return a Blob even
         * when backend sends JSON.
         */
        let message =
          "Unable to open student resume.";

        if (
          err.response?.data instanceof
          Blob
        ) {
          try {
            const text =
              await err.response.data.text();

            const parsed =
              JSON.parse(text);

            message =
              parsed.message ||
              message;
          } catch {
            // Keep default message.
          }
        } else {
          message =
            err.response?.data?.message ||
            message;
        }

        setError(message);
      } finally {
        setResumeLoadingId(null);
      }
    };


  /*
   * =========================================================
   * ANALYTICS
   * =========================================================
   */
  const overview =
    analytics?.overview || {};

  const typeCounts =
    analytics?.opportunityTypes || {};


  /*
   * Calculate application status
   * directly from the application list.
   */
  const applicationStatusCounts =
    applications.reduce(
      (
        counts,
        application
      ) => {
        const status =
          application.status ||
          "Interested";

        counts[status] =
          (counts[status] || 0) +
          1;

        return counts;
      },
      {}
    );


  return (
    <div className="admin-page">
      <div className="admin-shell">

        {/* =================================================
            TOP BAR
        ================================================== */}

        <header className="admin-topbar">

          <div className="admin-brand">

            <div className="admin-brand-icon">
              <ShieldCheck
                size={18}
              />
            </div>

            <div>
              <div className="admin-brand-name">
                CampusLaunch
              </div>

              <div className="admin-brand-subtitle">
                Admin Console
              </div>
            </div>

          </div>

          <div className="admin-topbar-actions">

            <button
              type="button"
              className="admin-secondary-button"
              onClick={loadAll}
              disabled={
                loading ||
                applicationsLoading
              }
            >
              <RefreshCw
                size={15}
                className={
                  loading ||
                  applicationsLoading
                    ? "admin-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

        </header>


        <main className="admin-main">

          {/* =================================================
              HERO
          ================================================== */}

          <section className="admin-hero">

            <div>

              <span className="admin-eyebrow">
                CONTROL CENTER
              </span>

              <h1>
                Opportunity Intelligence
              </h1>

              <p>
                Manage student opportunities,
                verify listings, monitor
                applications and keep the
                CampusLaunch ecosystem clean.
              </p>

            </div>

            <div className="admin-hero-actions">

              <button
                type="button"
                className="admin-secondary-button"
                onClick={
                  syncHimalayas
                }
                disabled={syncing}
              >
                <RefreshCw
                  size={15}
                  className={
                    syncing
                      ? "admin-spin"
                      : ""
                  }
                />

                {syncing
                  ? "Syncing..."
                  : "Sync Himalayas"}
              </button>

              <button
                type="button"
                className="admin-primary-button"
                onClick={
                  openCreateForm
                }
              >
                <Plus size={15} />

                Add Opportunity
              </button>

            </div>

          </section>


          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="admin-alert admin-alert-error">

              <AlertCircle
                size={17}
              />

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  setError("")
                }
              >
                <X size={15} />
              </button>

            </div>
          )}


          {/* =================================================
              SUCCESS
          ================================================== */}

          {success && (
            <div className="admin-alert admin-alert-success">

              <CheckCircle2
                size={17}
              />

              <span>
                {success}
              </span>

              <button
                type="button"
                onClick={() =>
                  setSuccess("")
                }
              >
                <X size={15} />
              </button>

            </div>
          )}


          {/* =================================================
              OVERVIEW
          ================================================== */}

          <section className="admin-overview-grid">

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Users size={18} />
              </div>

              <div>
                <span>
                  Total Students
                </span>

                <strong>
                  {
                    overview.totalStudents ??
                    0
                  }
                </strong>
              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <BriefcaseBusiness
                  size={18}
                />
              </div>

              <div>
                <span>
                  Total Opportunities
                </span>

                <strong>
                  {
                    overview.totalOpportunities ??
                    opportunities.length
                  }
                </strong>
              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <FileCheck2
                  size={18}
                />
              </div>

              <div>
                <span>
                  Total Applications
                </span>

                <strong>
                  {
                    applications.length
                  }
                </strong>
              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <Bookmark size={18} />
              </div>

              <div>
                <span>
                  Total Saved
                </span>

                <strong>
                  {
                    overview.totalSaved ??
                    0
                  }
                </strong>
              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <CheckCircle2
                  size={18}
                />
              </div>

              <div>
                <span>
                  Open Opportunities
                </span>

                <strong>
                  {
                    overview.openOpportunities ??
                    0
                  }
                </strong>
              </div>

            </div>


            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                <ShieldCheck
                  size={18}
                />
              </div>

              <div>
                <span>
                  Verified
                </span>

                <strong>
                  {
                    overview.verifiedOpportunities ??
                    0
                  }
                </strong>
              </div>

            </div>

          </section>


          {/* =================================================
              ANALYTICS
          ================================================== */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span className="admin-eyebrow">
                  ANALYTICS
                </span>

                <h2>
                  Platform Overview
                </h2>

                <p className="admin-section-description">
                  Monitor opportunity and
                  application activity.
                </p>

              </div>

            </div>


            <div className="admin-analytics-grid">

              {/* OPPORTUNITY TYPES */}

              <div className="admin-panel">

                <div className="admin-panel-header">

                  <div>

                    <h3>
                      Opportunity Types
                    </h3>

                    <p>
                      Distribution of active
                      opportunity records.
                    </p>

                  </div>

                  <BarChart3
                    size={18}
                  />

                </div>


                <div className="admin-mini-list">

                  {Object.entries(
                    typeCounts
                  ).length ===
                  0 ? (
                    <div className="admin-empty">
                      No analytics
                      available.
                    </div>
                  ) : (
                    Object.entries(
                      typeCounts
                    ).map(
                      (
                        [
                          type,
                          count,
                        ]
                      ) => (
                        <div
                          className="admin-mini-row"
                          key={type}
                        >
                          <span>
                            {type}
                          </span>

                          <strong>
                            {count}
                          </strong>
                        </div>
                      )
                    )
                  )}

                </div>

              </div>


              {/* APPLICATION STATUS */}

              <div className="admin-panel">

                <div className="admin-panel-header">

                  <div>

                    <h3>
                      Application Status
                    </h3>

                    <p>
                      Student application
                      pipeline.
                    </p>

                  </div>

                  <FileCheck2
                    size={18}
                  />

                </div>


                <div className="admin-mini-list">

                  {applicationsLoading ? (
                    <div className="admin-empty">
                      Loading application
                      analytics...
                    </div>
                  ) : Object.entries(
                      applicationStatusCounts
                    ).length === 0 ? (
                    <div className="admin-empty">
                      No student
                      applications yet.
                    </div>
                  ) : (
                    Object.entries(
                      applicationStatusCounts
                    ).map(
                      (
                        [
                          status,
                          count,
                        ]
                      ) => (
                        <div
                          className="admin-mini-row"
                          key={status}
                        >
                          <span>
                            {status}
                          </span>

                          <strong>
                            {count}
                          </strong>
                        </div>
                      )
                    )
                  )}

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              OPPORTUNITIES
          ================================================== */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span className="admin-eyebrow">
                  OPPORTUNITY MANAGEMENT
                </span>

                <h2>
                  All Opportunities
                </h2>

                <p className="admin-section-description">
                  Admin view includes verified,
                  unverified, closed and expired
                  records.
                </p>

              </div>


              <div className="admin-section-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    syncHimalayas
                  }
                  disabled={syncing}
                >
                  <RefreshCw
                    size={14}
                    className={
                      syncing
                        ? "admin-spin"
                        : ""
                    }
                  />

                  Sync
                </button>


                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={
                    openCreateForm
                  }
                >
                  <Plus size={14} />

                  Add
                </button>

              </div>

            </div>


            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Opportunity
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Deadline
                    </th>

                    <th>
                      Source
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Verification
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="admin-table-empty"
                      >
                        Loading
                        opportunities...
                      </td>
                    </tr>
                  ) : opportunities.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="admin-table-empty"
                      >
                        No opportunities
                        found.
                      </td>
                    </tr>
                  ) : (
                    opportunities.map(
                      (
                        opportunity
                      ) => (
                        <tr
                          key={
                            opportunity._id
                          }
                        >

                          <td>

                            <div className="admin-opportunity-cell">

                              <strong>
                                {
                                  opportunity.title
                                }
                              </strong>

                              <span>
                                {
                                  opportunity.organization
                                }
                              </span>

                            </div>

                          </td>


                          <td>

                            <span className="admin-badge">
                              {
                                opportunity.type
                              }
                            </span>

                          </td>


                          <td>

                            <div
                              className={`admin-deadline ${getDeadlineClass(
                                opportunity.deadlineInfo
                              )}`}
                            >

                              <strong>
                                {formatDate(
                                  opportunity.deadline
                                )}
                              </strong>

                              {
                                opportunity
                                  .deadlineInfo
                                  ?.daysLeft !==
                                  undefined && (
                                  <span>
                                    {
                                      opportunity
                                        .deadlineInfo
                                        .daysLeft
                                    }{" "}
                                    days left
                                  </span>
                                )
                              }

                            </div>

                          </td>


                          <td>

                            <div>

                              <span>
                                {
                                  opportunity.source
                                }
                              </span>

                              {
                                opportunity.source ===
                                  "Himalayas" && (
                                  <span className="admin-source-label">
                                    External API
                                  </span>
                                )
                              }

                            </div>

                          </td>


                          <td>

                            <span
                              className={`admin-status ${
                                opportunity.status ===
                                "Open"
                                  ? "admin-status-open"
                                  : "admin-status-closed"
                              }`}
                            >
                              {
                                opportunity.status
                              }
                            </span>

                          </td>


                          <td>

                            {
                              opportunity.verified ? (
                                <span className="admin-verified">

                                  <Check
                                    size={13}
                                  />

                                  Verified

                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="admin-verify-button"
                                  onClick={() =>
                                    verifyOpportunity(
                                      opportunity._id
                                    )
                                  }
                                >
                                  Verify
                                </button>
                              )
                            }

                          </td>


                          <td>

                            <div className="admin-row-actions">

                              {
                                opportunity.applicationUrl && (
                                  <a
                                    href={
                                      opportunity.applicationUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="admin-icon-button"
                                    title="Open application"
                                  >
                                    <ExternalLink
                                      size={14}
                                    />
                                  </a>
                                )
                              }


                              <button
                                type="button"
                                className="admin-icon-button"
                                onClick={() =>
                                  openEditForm(
                                    opportunity
                                  )
                                }
                                title="Edit"
                              >
                                <Edit3
                                  size={14}
                                />
                              </button>


                              <button
                                type="button"
                                className="admin-icon-button admin-danger-icon"
                                onClick={() =>
                                  deleteOpportunity(
                                    opportunity._id
                                  )
                                }
                                title="Delete"
                              >
                                <Trash2
                                  size={14}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* =================================================
              STUDENT APPLICATIONS
          ================================================== */}

          <section className="admin-section">

            <div className="admin-section-heading">

              <div>

                <span className="admin-eyebrow">
                  STUDENT ACTIVITY
                </span>

                <h2>
                  Student Applications
                </h2>

                <p className="admin-section-description">
                  See which student is tracking
                  or applying to which
                  opportunity.
                </p>

              </div>

            </div>


            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Student
                    </th>

                    <th>
                      College / Course
                    </th>

                    <th>
                      Opportunity
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Applied At
                    </th>

                    <th>
                      Resume
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {applicationsLoading ? (
                    <tr>

                      <td
                        colSpan="7"
                        className="admin-table-empty"
                      >
                        Loading applications...
                      </td>

                    </tr>
                  ) : applications.length ===
                    0 ? (
                    <tr>

                      <td
                        colSpan="7"
                        className="admin-table-empty"
                      >
                        No student
                        applications yet.
                      </td>

                    </tr>
                  ) : (
                    applications.map(
                      (
                        application
                      ) => {

                        const student =
                          application.student;

                        const opportunity =
                          application.opportunity;

                        const hasResume =
                          Boolean(
                            student?.resume
                              ?.filename
                          );

                        return (
                          <tr
                            key={
                              application._id
                            }
                          >

                            {/* STUDENT */}

                            <td>

                              <div className="admin-opportunity-cell">

                                <strong>
                                  {
                                    student?.name ||
                                    "Unknown Student"
                                  }
                                </strong>

                                <span>
                                  {
                                    student?.email ||
                                    "No email"
                                  }
                                </span>

                              </div>

                            </td>


                            {/* COLLEGE / COURSE */}

                            <td>

                              <div className="admin-opportunity-cell">

                                <strong>
                                  {
                                    student?.college ||
                                    "—"
                                  }
                                </strong>

                                <span>

                                  {
                                    student?.course ||
                                    "—"
                                  }

                                  {
                                    student?.year
                                      ? ` • Year ${student.year}`
                                      : ""
                                  }

                                </span>

                              </div>

                            </td>


                            {/* OPPORTUNITY */}

                            <td>

                              <div className="admin-opportunity-cell">

                                <strong>
                                  {
                                    opportunity?.title ||
                                    "Opportunity removed"
                                  }
                                </strong>

                                <span>
                                  {
                                    opportunity?.organization ||
                                    "—"
                                  }
                                </span>

                              </div>

                            </td>


                            {/* TYPE */}

                            <td>

                              <span className="admin-badge">
                                {
                                  opportunity?.type ||
                                  "—"
                                }
                              </span>

                            </td>


                            {/* STATUS */}

                            <td>

                              <span className="admin-status admin-status-open">
                                {
                                  application.status ||
                                  "Interested"
                                }
                              </span>

                            </td>


                            {/* APPLIED DATE */}

                            <td>

                              {
                                application.appliedAt
                                  ? formatDate(
                                      application.appliedAt
                                    )
                                  : "—"
                              }

                            </td>


                            {/* RESUME */}

                            <td>

                              {
                                hasResume ? (
                                  <div className="admin-resume-cell">

                                    <button
                                      type="button"
                                      className="admin-resume-button"
                                      onClick={() =>
                                        viewStudentResume(
                                          student._id
                                        )
                                      }
                                      disabled={
                                        resumeLoadingId ===
                                        student._id
                                      }
                                      title="View student resume"
                                    >

                                      {
                                        resumeLoadingId ===
                                        student._id ? (
                                          <>
                                            <RefreshCw
                                              size={13}
                                              className="admin-spin"
                                            />

                                            Opening...
                                          </>
                                        ) : (
                                          <>
                                            <FileText
                                              size={13}
                                            />

                                            View Resume
                                          </>
                                        )
                                      }

                                    </button>


                                    {
                                      student
                                        ?.resume
                                        ?.size && (
                                        <span className="admin-source-label">
                                          {
                                            formatFileSize(
                                              student
                                                .resume
                                                .size
                                            )
                                          }
                                        </span>
                                      )
                                    }

                                  </div>
                                ) : (
                                  <span className="admin-no-resume">
                                    No resume
                                  </span>
                                )
                              }

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        </main>


        {/* =================================================
            BOTTOM LEFT LOGOUT
        ================================================== */}

        <div className="admin-bottom-logout">

          <button
            type="button"
            onClick={logout}
          >
            <LogOut size={15} />

            Sign out
          </button>

        </div>

      </div>


      {/* =================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              resetForm();
            }
          }}
        >

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>

                <span className="admin-eyebrow">
                  {editingId
                    ? "EDIT"
                    : "CREATE"}
                </span>

                <h2>
                  {editingId
                    ? "Edit Opportunity"
                    : "Add Opportunity"}
                </h2>

              </div>


              <button
                type="button"
                className="admin-icon-button"
                onClick={
                  resetForm
                }
              >
                <X size={17} />
              </button>

            </div>


            <form
              className="admin-form"
              onSubmit={
                handleSubmit
              }
            >

              <div className="admin-form-grid">

                <label>

                  <span>
                    Title
                  </span>

                  <input
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </label>


                <label>

                  <span>
                    Organization
                  </span>

                  <input
                    name="organization"
                    value={
                      form.organization
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </label>


                <label>

                  <span>
                    Type
                  </span>

                  <select
                    name="type"
                    value={
                      form.type
                    }
                    onChange={
                      handleChange
                    }
                  >
                    {
                      OPPORTUNITY_TYPES.map(
                        (type) => (
                          <option
                            value={
                              type
                            }
                            key={
                              type
                            }
                          >
                            {type}
                          </option>
                        )
                      )
                    }
                  </select>

                </label>


                <label>

                  <span>
                    Mode
                  </span>

                  <select
                    name="mode"
                    value={
                      form.mode
                    }
                    onChange={
                      handleChange
                    }
                  >
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

                </label>


                <label>

                  <span>
                    Location
                  </span>

                  <input
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                  />

                </label>


                <label>

                  <span>
                    Stipend / Prize
                  </span>

                  <input
                    name="stipend"
                    value={
                      form.stipend
                    }
                    onChange={
                      handleChange
                    }
                  />

                </label>


                <label>

                  <span>
                    Deadline
                  </span>

                  <input
                    type="date"
                    name="deadline"
                    value={
                      form.deadline
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />

                </label>


                <label>

                  <span>
                    Source
                  </span>

                  <input
                    name="source"
                    value={
                      form.source
                    }
                    onChange={
                      handleChange
                    }
                  />

                </label>

              </div>


              <label>

                <span>
                  Skills
                </span>

                <input
                  name="skills"
                  value={
                    form.skills
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="React, JavaScript, Python, SQL"
                />

              </label>


              <label>

                <span>
                  Eligibility
                </span>

                <textarea
                  name="eligibility"
                  value={
                    form.eligibility
                  }
                  onChange={
                    handleChange
                  }
                  rows="3"
                />

              </label>


              <label>

                <span>
                  Description
                </span>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows="5"
                />

              </label>


              <label>

                <span>
                  Application URL
                </span>

                <input
                  type="url"
                  name="applicationUrl"
                  value={
                    form.applicationUrl
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

              </label>


              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    resetForm
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    saving
                  }
                >
                  {
                    saving
                      ? "Saving..."
                      : editingId
                      ? "Update Opportunity"
                      : "Create Opportunity"
                  }
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}


export default AdminDashboard;