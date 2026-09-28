import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

function AccountType() {
  return (
    <div className="account-type-page">

      <div className="account-type-card">

        {/* BRAND */}

        <div className="account-type-brand">
          <div className="account-type-brand-mark">
            CL
          </div>

          <span>
            CampusLaunch
          </span>
        </div>

        {/* HEADER */}

        <div className="account-type-header">

          <span className="account-type-kicker">
            ACCOUNT ACCESS
          </span>

          <h1>
            How would you like
            <br />
            to continue?
          </h1>

          <p>
            Choose the account type that matches
            how you use CampusLaunch.
          </p>

        </div>

        {/* OPTIONS */}

        <div className="account-type-options">

          {/* STUDENT */}

          <Link
            to="/login/student"
            className="account-type-option"
          >

            <div className="account-type-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <div className="account-type-option-content">

              <span className="account-type-option-kicker">
                FOR STUDENTS
              </span>

              <strong>
                Student account
              </strong>

              <p>
                Discover opportunities, track
                applications and manage deadlines.
              </p>

            </div>

            <ArrowRight
              size={18}
              className="account-type-arrow"
            />

          </Link>

          {/* ADMIN */}

          <Link
            to="/login/admin"
            className="account-type-option"
          >

            <div className="account-type-icon">
              <ShieldCheck size={21} />
            </div>

            <div className="account-type-option-content">

              <span className="account-type-option-kicker">
                PLATFORM MANAGEMENT
              </span>

              <strong>
                Admin account
              </strong>

              <p>
                Manage opportunities, verification,
                users and platform intelligence.
              </p>

            </div>

            <ArrowRight
              size={18}
              className="account-type-arrow"
            />

          </Link>

        </div>

        {/* BACK */}

        <Link
          to="/"
          className="account-type-back"
        >
          ← Back to CampusLaunch
        </Link>

      </div>

    </div>
  );
}

export default AccountType;