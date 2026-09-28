import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Save,
  UserRound,
  Upload,
  ExternalLink,
  X,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: 1,
    skills: "",
    interests: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // RESUME STATE
  // =====================================================

  const [resumeFile, setResumeFile] =
    useState(null);

  const [resumePreviewUrl, setResumePreviewUrl] =
    useState("");

  const [existingResume, setExistingResume] =
    useState(null);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/auth/me"
          );

        const currentUser =
          response.data?.user ||
          response.data;

        setUser(currentUser);

        setForm({
          name:
            currentUser.name || "",

          email:
            currentUser.email || "",

          phone:
            currentUser.phone || "",

          college:
            currentUser.college || "",

          course:
            currentUser.course || "",

          year:
            currentUser.year || 1,

          skills:
            Array.isArray(
              currentUser.skills
            )
              ? currentUser.skills.join(
                  ", "
                )
              : "",

          interests:
            Array.isArray(
              currentUser.interests
            )
              ? currentUser.interests.join(
                  ", "
                )
              : "",
        });

        setExistingResume(
          currentUser.resume || null
        );
      } catch (err) {
        console.error(
          "Profile loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =====================================================
  // CLEAN PREVIEW URL
  // =====================================================

  useEffect(() => {
    return () => {
      if (resumePreviewUrl) {
        URL.revokeObjectURL(
          resumePreviewUrl
        );
      }
    };
  }, [resumePreviewUrl]);

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const updateField = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // =====================================================
  // SELECT RESUME
  // =====================================================

  const handleResumeChange = (
    event
  ) => {
    setMessage("");
    setError("");

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // PDF validation
    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      setError(
        "Please upload your resume as a PDF file."
      );

      event.target.value = "";
      return;
    }

    // 5 MB validation
    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Resume must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    // Clean previous local preview
    if (resumePreviewUrl) {
      URL.revokeObjectURL(
        resumePreviewUrl
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    setResumeFile(file);

    setResumePreviewUrl(
      previewUrl
    );

    setMessage(
      "Resume selected. Click Save changes to upload it."
    );
  };

  // =====================================================
  // REMOVE NEWLY SELECTED RESUME
  // =====================================================

  const removeResume = () => {
    if (resumePreviewUrl) {
      URL.revokeObjectURL(
        resumePreviewUrl
      );
    }

    setResumeFile(null);
    setResumePreviewUrl("");
    setMessage("");

    const input =
      document.getElementById(
        "profile-resume-input"
      );

    if (input) {
      input.value = "";
    }
  };

  // =====================================================
  // PREVIEW SAVED RESUME
  // =====================================================

  const previewExistingResume =
    async () => {
      try {
        setError("");

        const response =
          await api.get(
            "/auth/profile/resume",
            {
              responseType:
                "blob",
            }
          );

        const blobUrl =
          URL.createObjectURL(
            response.data
          );

        window.open(
          blobUrl,
          "_blank",
          "noopener,noreferrer"
        );

        setTimeout(() => {
          URL.revokeObjectURL(
            blobUrl
          );
        }, 60000);
      } catch (err) {
        console.error(
          "Resume preview error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to open your resume."
        );
      }
    };

  // =====================================================
  // DELETE SAVED RESUME
  // =====================================================

  const removeExistingResume =
    async () => {
      const confirmed =
        window.confirm(
          "Remove your saved resume?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setMessage("");

        await api.delete(
          "/auth/profile/resume"
        );

        setExistingResume(null);

        setMessage(
          "Resume removed successfully."
        );

        const input =
          document.getElementById(
            "profile-resume-input"
          );

        if (input) {
          input.value = "";
        }
      } catch (err) {
        console.error(
          "Resume removal error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to remove your resume."
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // SAVE PROFILE + RESUME
  // =====================================================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Basic validation
    if (!form.name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    if (!form.email.trim()) {
      setError(
        "Please enter your email."
      );
      return;
    }

    if (!form.phone.trim()) {
      setError(
        "Please enter your WhatsApp / phone number."
      );
      return;
    }

    // Basic phone validation
    const phoneRegex =
      /^\+?[0-9\s-]{10,15}$/;

    if (
      !phoneRegex.test(
        form.phone.trim()
      )
    ) {
      setError(
        "Please enter a valid WhatsApp / phone number."
      );
      return;
    }

    if (!form.college.trim()) {
      setError(
        "Please enter your college."
      );
      return;
    }

    if (!form.course.trim()) {
      setError(
        "Please enter your course."
      );
      return;
    }

    try {
      setSaving(true);

      // =================================================
      // EVERYTHING IS SENT IN ONE MULTIPART REQUEST
      // =================================================

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "email",
        form.email
          .trim()
          .toLowerCase()
      );

      formData.append(
        "phone",
        form.phone.trim()
      );

      formData.append(
        "college",
        form.college.trim()
      );

      formData.append(
        "course",
        form.course.trim()
      );

      formData.append(
        "year",
        String(form.year)
      );

      formData.append(
        "skills",
        JSON.stringify(
          form.skills
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        )
      );

      formData.append(
        "interests",
        JSON.stringify(
          form.interests
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean)
        )
      );

      // =================================================
      // ADD RESUME ONLY IF A NEW ONE WAS SELECTED
      // =================================================

      if (resumeFile) {
        formData.append(
          "resume",
          resumeFile
        );
      }

      // =================================================
      // SINGLE BACKEND REQUEST
      // =================================================

      const response =
        await api.put(
          "/auth/profile",
          formData
        );

      const updatedUser =
        response.data?.user;

      // =================================================
      // UPDATE FRONTEND STATE
      // =================================================

      if (updatedUser) {
        setUser(updatedUser);

        setForm({
          name:
            updatedUser.name || "",

          email:
            updatedUser.email || "",

          phone:
            updatedUser.phone || "",

          college:
            updatedUser.college || "",

          course:
            updatedUser.course || "",

          year:
            updatedUser.year || 1,

          skills:
            Array.isArray(
              updatedUser.skills
            )
              ? updatedUser.skills.join(
                  ", "
                )
              : "",

          interests:
            Array.isArray(
              updatedUser.interests
            )
              ? updatedUser.interests.join(
                  ", "
                )
              : "",
        });

        /*
         * Backend returns resume metadata
         * but NOT resume.data.
         */
        setExistingResume(
          updatedUser.resume ||
            existingResume ||
            null
        );
      }

      // =================================================
      // CLEAN LOCAL RESUME STATE
      // =================================================

      if (resumeFile) {
        if (resumePreviewUrl) {
          URL.revokeObjectURL(
            resumePreviewUrl
          );
        }

        setResumeFile(null);
        setResumePreviewUrl("");

        const input =
          document.getElementById(
            "profile-resume-input"
          );

        if (input) {
          input.value = "";
        }
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        response.data?.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="profile-page profile-state">
        <div className="profile-loading-card">
          <div className="profile-spinner" />

          <p>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="profile-page">
      <div className="profile-shell">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="profile-header">

          <Link
            to="/dashboard"
            className="profile-back"
          >
            <ArrowLeft size={15} />

            Dashboard
          </Link>

          <span>
            CampusLaunch
          </span>

        </header>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="profile-hero">

          <div className="profile-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </div>

          <div>

            <span className="profile-eyebrow">
              STUDENT PROFILE
            </span>

            <h1>
              {user?.name ||
                "Your profile"}
            </h1>

            <p>
              Keep your academic
              information, skills,
              interests and WhatsApp
              details up to date.
            </p>

          </div>

        </section>

        {/* =================================================
            PROFILE FORM
        ================================================= */}

        <form
          className="profile-card"
          onSubmit={handleSave}
        >

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="profile-section-title">

            <UserRound size={18} />

            <div>

              <h2>
                Personal information
              </h2>

              <p>
                Your account and
                notification details.
              </p>

            </div>

          </div>

          <div className="profile-grid">

            <div className="profile-field">

              <label htmlFor="profile-name">
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value
                  )
                }
                disabled={saving}
                required
              />

            </div>

            <div className="profile-field">

              <label htmlFor="profile-email">
                Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                disabled={saving}
                required
              />

            </div>

            <div className="profile-field">

              <label htmlFor="profile-phone">
                WhatsApp / Phone number
              </label>

              <input
                id="profile-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="+91 9876543210"
                disabled={saving}
                required
              />

              <small>
                Used for CampusLaunch
                deadline reminders on
                WhatsApp.
              </small>

            </div>

          </div>

          {/* =================================================
              ACADEMIC PROFILE
          ================================================= */}

          <div className="profile-section-title">

            <FileText size={18} />

            <div>

              <h2>
                Academic profile
              </h2>

              <p>
                Used to personalize
                opportunity
                recommendations.
              </p>

            </div>

          </div>

          <div className="profile-grid">

            <div className="profile-field">

              <label htmlFor="profile-college">
                College / university
              </label>

              <input
                id="profile-college"
                type="text"
                value={form.college}
                onChange={(event) =>
                  updateField(
                    "college",
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>

            <div className="profile-field">

              <label htmlFor="profile-course">
                Course
              </label>

              <input
                id="profile-course"
                type="text"
                value={form.course}
                onChange={(event) =>
                  updateField(
                    "course",
                    event.target.value
                  )
                }
                disabled={saving}
              />

            </div>

            <div className="profile-field">

              <label htmlFor="profile-year">
                Year
              </label>

              <select
                id="profile-year"
                value={form.year}
                onChange={(event) =>
                  updateField(
                    "year",
                    Number(
                      event.target.value
                    )
                  )
                }
                disabled={saving}
              >

                <option value={1}>
                  1st Year
                </option>

                <option value={2}>
                  2nd Year
                </option>

                <option value={3}>
                  3rd Year
                </option>

                <option value={4}>
                  4th Year
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              SKILLS & INTERESTS
          ================================================= */}

          <div className="profile-section-title">

            <CheckCircle2 size={18} />

            <div>

              <h2>
                Skills & interests
              </h2>

              <p>
                Separate multiple
                items with commas.
              </p>

            </div>

          </div>

          <div className="profile-grid">

            <div className="profile-field">

              <label htmlFor="profile-skills">
                Skills
              </label>

              <input
                id="profile-skills"
                type="text"
                value={form.skills}
                onChange={(event) =>
                  updateField(
                    "skills",
                    event.target.value
                  )
                }
                placeholder="React, JavaScript, Python"
                disabled={saving}
              />

            </div>

            <div className="profile-field">

              <label htmlFor="profile-interests">
                Interests
              </label>

              <input
                id="profile-interests"
                type="text"
                value={form.interests}
                onChange={(event) =>
                  updateField(
                    "interests",
                    event.target.value
                  )
                }
                placeholder="Internships, Hackathons, AI"
                disabled={saving}
              />

            </div>

          </div>

          {/* =================================================
              RESUME
          ================================================= */}

          <div className="profile-resume">

            <FileText size={20} />

            <div>

              <strong>
                Resume
              </strong>

              <p>
                Upload your latest resume
                in PDF format. Maximum
                size: 5 MB.
              </p>

              {/* =================================================
                  SAVED RESUME
              ================================================= */}

              {existingResume &&
                !resumeFile && (
                  <div className="profile-existing-resume">

                    <strong>
                      {existingResume.filename ||
                        "Resume.pdf"}
                    </strong>

                    <p>
                      {existingResume.size
                        ? `${(
                            existingResume.size /
                            1024 /
                            1024
                          ).toFixed(
                            2
                          )} MB`
                        : "Saved resume"}
                    </p>

                    <div>

                      <button
                        type="button"
                        onClick={
                          previewExistingResume
                        }
                        disabled={saving}
                      >
                        <ExternalLink
                          size={14}
                        />

                        Preview
                      </button>

                      <button
                        type="button"
                        onClick={
                          removeExistingResume
                        }
                        disabled={saving}
                      >
                        <X size={14} />

                        Remove
                      </button>

                    </div>

                  </div>
                )}

              {/* =================================================
                  FILE INPUT
              ================================================= */}

              <input
                id="profile-resume-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleResumeChange
                }
                disabled={saving}
              />

              {/* =================================================
                  NEWLY SELECTED RESUME
              ================================================= */}

              {resumeFile && (
                <div className="profile-selected-resume">

                  <strong>
                    {resumeFile.name}
                  </strong>

                  <p>
                    {(
                      resumeFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                  <div>

                    <a
                      href={
                        resumePreviewUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink
                        size={14}
                      />

                      Preview
                    </a>

                    <button
                      type="button"
                      onClick={
                        removeResume
                      }
                      disabled={saving}
                    >
                      <X size={14} />

                      Remove
                    </button>

                  </div>

                </div>
              )}

              {/* =================================================
                  CHOOSE / REPLACE
              ================================================= */}

              {!resumeFile && (
                <label
                  htmlFor="profile-resume-input"
                  className="profile-resume-upload"
                >
                  <Upload size={16} />

                  {existingResume
                    ? "Replace resume"
                    : "Choose resume"}
                </label>
              )}

            </div>

          </div>

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {message && (
            <div className="profile-message profile-success">

              <CheckCircle2 size={16} />

              {message}

            </div>
          )}

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div className="profile-message profile-error">
              {error}
            </div>
          )}

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="profile-actions">

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >

              <Save size={16} />

              {saving
                ? "Saving..."
                : "Save changes"}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Profile;