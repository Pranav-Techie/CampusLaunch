import { ArrowRight, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AuthChoice() {
  const navigate = useNavigate();

  return (
    <main className="auth-choice-page">
      <div className="auth-choice-orbit auth-choice-orbit-one" />
      <div className="auth-choice-orbit auth-choice-orbit-two" />

      <section className="auth-choice-card">
        <Link to="/" className="auth-choice-brand">
          <span className="auth-choice-brand-mark">CL</span>
          <span>CampusLaunch</span>
        </Link>

        <div className="auth-choice-header">
          <span className="auth-choice-kicker">WELCOME TO CAMPUSLAUNCH</span>

          <h1>Choose your space.</h1>

          <p>
            Sign in to continue to the CampusLaunch workspace built around
            your role.
          </p>
        </div>

        <div className="auth-choice-options">
          <button
            type="button"
            className="auth-choice-option auth-choice-student"
            onClick={() => navigate("/login?role=student")}
          >
            <div className="auth-choice-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div className="auth-choice-option-content">
              <strong>Student</strong>

              <span>
                Discover opportunities, track applications and manage
                deadlines.
              </span>
            </div>

            <ArrowRight size={19} />
          </button>

          <button
            type="button"
            className="auth-choice-option auth-choice-admin"
            onClick={() => navigate("/login?role=admin")}
          >
            <div className="auth-choice-icon">
              <ShieldCheck size={21} />
            </div>

            <div className="auth-choice-option-content">
              <strong>Admin</strong>

              <span>
                Manage opportunities, verification and platform analytics.
              </span>
            </div>

            <ArrowRight size={19} />
          </button>
        </div>

        <div className="auth-choice-footer">
          <span>New student?</span>

          <Link to="/register">Create your CampusLaunch account</Link>
        </div>

        <Link to="/" className="auth-choice-back">
          ← Back to CampusLaunch
        </Link>
      </section>
    </main>
  );
}

export default AuthChoice;