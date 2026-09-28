import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  const chooseStudent = () => {
    navigate("/login?role=student");
  };

  const chooseAdmin = () => {
    navigate("/login?role=admin");
  };

  return (
    <div className="auth-page">
      {/* =====================================================
          BACK TO HOME
          ===================================================== */}

      <Link
        to="/"
        className="auth-back-link"
      >
        <ArrowLeft size={17} />
        <span>Back to CampusLaunch</span>
      </Link>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="auth-container">
        {/* ===================================================
            BRAND
            =================================================== */}

        <div className="auth-brand">
          <Link
            to="/"
            className="auth-brand-link"
          >
            <span className="auth-brand-mark">
              CL
            </span>

            <span className="auth-brand-name">
              CampusLaunch
            </span>
          </Link>
        </div>

        {/* ===================================================
            HEADER
            =================================================== */}

        <div className="auth-heading">
          <span className="auth-kicker">
            YOUR OPPORTUNITY SPACE
          </span>

          <h1>
            Choose how you want
            <br />
            to enter CampusLaunch.
          </h1>

          <p>
            Whether you're discovering opportunities or
            managing them, CampusLaunch gives you the
            right workspace for your role.
          </p>
        </div>

        {/* ===================================================
            ROLE CARDS
            =================================================== */}

        <div className="auth-role-grid">
          {/* =================================================
              STUDENT
              ================================================= */}

          <button
            type="button"
            className="auth-role-card auth-role-student"
            onClick={chooseStudent}
          >
            <div className="auth-role-top">
              <div className="auth-role-icon student">
                <GraduationCap size={26} />
              </div>

              <span className="auth-role-arrow">
                <ArrowRight size={20} />
              </span>
            </div>

            <div className="auth-role-content">
              <span className="auth-role-label">
                FOR STUDENTS
              </span>

              <h2>
                Student
              </h2>

              <p>
                Discover opportunities that match your
                skills, interests, course and career goals.
              </p>
            </div>

            <div className="auth-role-features">
              <div>
                <CheckCircle2 size={15} />
                Personalized opportunities
              </div>

              <div>
                <CheckCircle2 size={15} />
                Match scores
              </div>

              <div>
                <CheckCircle2 size={15} />
                Application tracking
              </div>

              <div>
                <CheckCircle2 size={15} />
                Deadline reminders
              </div>
            </div>

            <div className="auth-role-action">
              Continue as Student
              <ArrowRight size={17} />
            </div>
          </button>

          {/* =================================================
              ADMIN
              ================================================= */}

          <button
            type="button"
            className="auth-role-card auth-role-admin"
            onClick={chooseAdmin}
          >
            <div className="auth-role-top">
              <div className="auth-role-icon admin">
                <ShieldCheck size={26} />
              </div>

              <span className="auth-role-arrow">
                <ArrowRight size={20} />
              </span>
            </div>

            <div className="auth-role-content">
              <span className="auth-role-label">
                FOR ADMINISTRATORS
              </span>

              <h2>
                Admin
              </h2>

              <p>
                Manage opportunities, verify listings and
                monitor student activity from one workspace.
              </p>
            </div>

            <div className="auth-role-features">
              <div>
                <CheckCircle2 size={15} />
                Opportunity management
              </div>

              <div>
                <CheckCircle2 size={15} />
                Verification controls
              </div>

              <div>
                <CheckCircle2 size={15} />
                Application analytics
              </div>

              <div>
                <CheckCircle2 size={15} />
                Platform overview
              </div>
            </div>

            <div className="auth-role-action">
              Continue as Admin
              <ArrowRight size={17} />
            </div>
          </button>
        </div>

        {/* ===================================================
            DIFFERENTIATOR
            =================================================== */}

        <div className="auth-bottom-note">
          <div className="auth-bottom-icon">
            <Sparkles size={17} />
          </div>

          <div>
            <strong>
              One platform. Two focused experiences.
            </strong>

            <span>
              Students focus on finding and acting on
              opportunities. Admins focus on keeping the
              opportunity ecosystem useful and reliable.
            </span>
          </div>
        </div>

        {/* ===================================================
            FOOTER
            =================================================== */}

        <div className="auth-footer">
          <span>
            © {new Date().getFullYear()} CampusLaunch
          </span>

          <div>
            <Users size={14} />
            Built for students and opportunity teams
          </div>
        </div>
      </main>
    </div>
  );
}

export default Auth;