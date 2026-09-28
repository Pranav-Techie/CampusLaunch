import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: "3",
    skills: "",
    interests: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.college.trim() ||
      !form.course.trim() ||
      !form.year ||
      !form.skills.trim() ||
      !form.interests.trim() ||
      !form.password
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone.trim())) {
      setError(
        "Please enter a valid WhatsApp / phone number."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        college: form.college.trim(),
        course: form.course.trim(),
        year: Number(form.year),

        skills: form.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        interests: form.interests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      setSuccess(
        "Your CampusLaunch account has been created successfully."
      );

      setTimeout(() => {
        navigate("/login?role=student", {
          replace: true,
          state: {
            registered: true,
          },
        });
      }, 700);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-visual">
        <Link to="/" className="register-brand">
          <span className="register-brand-mark">
            CL
          </span>

          <span>CampusLaunch</span>
        </Link>

        <div className="register-visual-content">
          <span className="register-kicker">
            BUILD YOUR OPPORTUNITY SPACE
          </span>

          <h1>
            Your next step
            <br />
            starts here.
          </h1>

          <p>
            Create your student profile once and use
            CampusLaunch to discover, match, track and act
            on opportunities.
          </p>

          <div className="register-benefits">
            <div className="register-benefit">
              <div className="register-benefit-icon">
                <GraduationCap size={18} />
              </div>

              <div>
                <strong>
                  Student-first profile
                </strong>

                <span>
                  Keep your course, college and interests
                  in one place.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <strong>
                  Personalized opportunities
                </strong>

                <span>
                  Find opportunities that fit your profile
                  and goals.
                </span>
              </div>
            </div>

            <div className="register-benefit">
              <div className="register-benefit-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>
                  One organized journey
                </strong>

                <span>
                  Keep applications and deadlines easier to
                  manage.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="register-form-section">
        <div className="register-form-wrapper">
          <div className="register-mobile-brand">
            <span className="register-brand-mark">
              CL
            </span>

            <span>CampusLaunch</span>
          </div>

          <div className="register-form-header">
            <span className="register-form-kicker">
              STUDENT REGISTRATION
            </span>

            <h2>Create your account</h2>

            <p>
              Tell us about yourself so CampusLaunch can
              personalize your opportunities.
            </p>
          </div>

          {error && (
            <div className="register-message register-error">
              {error}
            </div>
          )}

          {success && (
            <div className="register-message register-success">
              {success}
            </div>
          )}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >
            {/* NAME + EMAIL */}

            <div className="register-two-column">
              <div className="register-field">
                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Pranav Kumar Jha"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="register-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PHONE / WHATSAPP */}

            <div className="register-field">
              <label htmlFor="register-phone">
                WhatsApp / Phone number
              </label>

              <input
                id="register-phone"
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                disabled={loading}
                autoComplete="tel"
              />

              <span className="register-field-hint">
                Used for important CampusLaunch deadline
                reminders.
              </span>
            </div>

            {/* COLLEGE */}

            <div className="register-field">
              <label htmlFor="register-college">
                College / university
              </label>

              <input
                id="register-college"
                type="text"
                placeholder="SRM Institute of Science and Technology"
                value={form.college}
                onChange={(event) =>
                  updateField(
                    "college",
                    event.target.value
                  )
                }
                disabled={loading}
              />
            </div>

            {/* COURSE + YEAR */}

            <div className="register-two-column">
              <div className="register-field">
                <label htmlFor="register-course">
                  Course
                </label>

                <input
                  id="register-course"
                  type="text"
                  placeholder="B.Tech CSE"
                  value={form.course}
                  onChange={(event) =>
                    updateField(
                      "course",
                      event.target.value
                    )
                  }
                  disabled={loading}
                />
              </div>

              <div className="register-field">
                <label htmlFor="register-year">
                  Year
                </label>

                <select
                  id="register-year"
                  value={form.year}
                  onChange={(event) =>
                    updateField(
                      "year",
                      event.target.value
                    )
                  }
                  disabled={loading}
                >
                  <option value="1">
                    1st Year
                  </option>

                  <option value="2">
                    2nd Year
                  </option>

                  <option value="3">
                    3rd Year
                  </option>

                  <option value="4">
                    4th Year
                  </option>
                </select>
              </div>
            </div>

            {/* SKILLS */}

            <div className="register-field">
              <label htmlFor="register-skills">
                Skills
              </label>

              <input
                id="register-skills"
                type="text"
                placeholder="React, JavaScript, Python, SQL"
                value={form.skills}
                onChange={(event) =>
                  updateField(
                    "skills",
                    event.target.value
                  )
                }
                disabled={loading}
              />

              <span className="register-field-hint">
                Separate multiple skills with commas.
              </span>
            </div>

            {/* INTERESTS */}

            <div className="register-field">
              <label htmlFor="register-interests">
                Interests
              </label>

              <input
                id="register-interests"
                type="text"
                placeholder="Internships, Hackathons, AI"
                value={form.interests}
                onChange={(event) =>
                  updateField(
                    "interests",
                    event.target.value
                  )
                }
                disabled={loading}
              />

              <span className="register-field-hint">
                Separate multiple interests with commas.
              </span>
            </div>

            {/* PASSWORD */}

            <div className="register-field">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-password-wrapper">
                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(event) =>
                    updateField(
                      "password",
                      event.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              <span className="register-field-hint">
                Use at least 6 characters.
              </span>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="register-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create student account
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <div className="register-existing">
            Already have an account?

            <Link to="/login?role=student">
              Sign in
            </Link>
          </div>

          <div className="register-security">
            <ShieldCheck size={14} />

            Your account is protected by CampusLaunch
            authentication.
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;