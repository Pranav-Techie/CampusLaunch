import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  /*
   * /login       -> Student login
   * /login/admin -> Admin login
   */
  const isAdminLogin =
    location.pathname === "/login/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * IMPORTANT:
       * Tell the backend which account type
       * this login page expects.
       *
       * Student page -> student
       * Admin page   -> admin
       */
      const expectedRole =
        isAdminLogin
          ? "admin"
          : "student";

      const loggedInUser =
        await login(
          email.trim(),
          password,
          expectedRole
        );

      console.log(
        "CampusLaunch login:",
        loggedInUser
      );

      /*
       * Extra frontend protection.
       * Even after successful login, send the
       * user only to the dashboard matching
       * their actual role.
       */
      if (
        loggedInUser?.role === "admin"
      ) {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-page ${
        isAdminLogin
          ? "admin-login-page"
          : "student-login-page"
      }`}
    >
      {/* =====================================================
          LEFT / VISUAL SECTION
      ====================================================== */}

      <section className="login-visual">
        <div className="login-visual-inner">

          <Link
            to="/"
            className="login-brand"
          >
            <div className="login-brand-mark">
              CL
            </div>

            <span className="login-brand-name">
              CampusLaunch
            </span>
          </Link>

          <div className="login-visual-content">

            <div className="login-eyebrow">
              <span className="login-eyebrow-dot" />

              {isAdminLogin
                ? "ADMIN ACCESS"
                : "STUDENT OPPORTUNITY INTELLIGENCE"}
            </div>

            <h1>
              {isAdminLogin ? (
                <>
                  Manage the
                  <br />
                  opportunity
                  <br />
                  ecosystem.
                </>
              ) : (
                <>
                  Your next
                  <br />
                  opportunity
                  <br />
                  starts here.
                </>
              )}
            </h1>

            <p>
              {isAdminLogin
                ? "Verify opportunities, monitor applications and keep CampusLaunch reliable for every student."
                : "Discover internships, hackathons, certifications and more — matched to your goals."}
            </p>

            <div className="login-insight-grid">

              <div className="login-insight-card">
                <strong>
                  {isAdminLogin
                    ? "VERIFY"
                    : "DISCOVER"}
                </strong>

                <span>
                  {isAdminLogin
                    ? "Review opportunity listings"
                    : "Find relevant opportunities"}
                </span>
              </div>

              <div className="login-insight-card">
                <strong>
                  {isAdminLogin
                    ? "MONITOR"
                    : "TRACK"}
                </strong>

                <span>
                  {isAdminLogin
                    ? "Monitor student activity"
                    : "Never lose an application"}
                </span>
              </div>

              <div className="login-insight-card">
                <strong>
                  {isAdminLogin
                    ? "INSIGHT"
                    : "MATCH"}
                </strong>

                <span>
                  {isAdminLogin
                    ? "Understand platform activity"
                    : "Opportunities aligned to you"}
                </span>
              </div>

            </div>

          </div>

          <div className="login-visual-footer">
            CampusLaunch
          </div>

        </div>
      </section>

      {/* =====================================================
          RIGHT / LOGIN FORM SECTION
      ====================================================== */}

      <section className="login-form-section">

        <div className="login-form-wrapper">

          <div className="login-form-header">

            <span className="login-form-kicker">
              {isAdminLogin
                ? "ADMIN CONSOLE"
                : "STUDENT PORTAL"}
            </span>

            <h2>
              {isAdminLogin
                ? "Admin sign in"
                : "Welcome back"}
            </h2>

            <p>
              {isAdminLogin
                ? "Sign in to manage CampusLaunch."
                : "Sign in to continue to your opportunity dashboard."}
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <label className="login-field">

              <div className="login-field-label-row">
                <span>
                  Email address
                </span>
              </div>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder={
                  isAdminLogin
                    ? "admin@campuslaunch.com"
                    : "you@example.com"
                }
                autoComplete="email"
                disabled={loading}
                required
              />

            </label>

            {/* PASSWORD */}

            <label className="login-field">

              <div className="login-field-label-row">
                <span>
                  Password
                </span>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={() =>
                    setError(
                      "Password reset will be available soon."
                    )
                  }
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <div className="login-password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </label>

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  {isAdminLogin
                    ? "Sign in as Admin"
                    : "Sign in"}

                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </form>

          {/* REGISTER LINK — STUDENT ONLY */}

          {!isAdminLogin && (
            <>
              <div className="login-divider">
                <span>
                  NEW TO CAMPUSLAUNCH?
                </span>
              </div>

              <Link
                to="/register"
                className="login-register-link"
              >
                Create student account

                <ArrowRight size={15} />
              </Link>
            </>
          )}

          {/* SECURITY MESSAGE */}

          <div className="login-security">
            <ShieldCheck size={14} />

            <span>
              {isAdminLogin
                ? "Protected administrator access"
                : "Your account information is securely protected"}
            </span>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;