import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  GraduationCap,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { Link } from "react-router-dom";

import api from "../services/api";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const opportunityIcons = {
  Internship: BriefcaseBusiness,
  Hackathon: Trophy,
  Certification: GraduationCap,
  Competition: Target,
  Scholarship: GraduationCap,
  Workshop: GraduationCap,
};

const opportunityColors = [
  "purple",
  "blue",
  "green",
];

function getOpportunityIcon(type) {
  return (
    opportunityIcons[type] ||
    BriefcaseBusiness
  );
}

function formatDeadline(deadline) {
  if (!deadline) {
    return "Deadline not listed";
  }

  const date = new Date(deadline);

  if (Number.isNaN(date.getTime())) {
    return "Deadline not listed";
  }

  return `Deadline ${date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  )}`;
}

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

function Home() {
  const [
    featuredOpportunities,
    setFeaturedOpportunities,
  ] = useState([]);

  const [
    opportunitiesLoading,
    setOpportunitiesLoading,
  ] = useState(true);

  /*
   * =====================================================
   * LOAD REAL OPPORTUNITIES
   * =====================================================
   */

  useEffect(() => {
    let isMounted = true;

    const loadOpportunities = async () => {
      try {
        setOpportunitiesLoading(true);

        const response = await api.get(
          "/opportunities"
        );

        const opportunities =
          Array.isArray(
            response.data?.opportunities
          )
            ? response.data.opportunities
            : [];

        /*
         * Prefer opportunities with a future deadline,
         * then sort by the nearest deadline.
         */

        const now = Date.now();

        const sorted =
          opportunities
            .filter((opportunity) => {
              if (!opportunity?.deadline) {
                return true;
              }

              const timestamp = new Date(
                opportunity.deadline
              ).getTime();

              return (
                Number.isNaN(timestamp) ||
                timestamp >= now
              );
            })
            .sort((a, b) => {
              const first = a?.deadline
                ? new Date(
                    a.deadline
                  ).getTime()
                : Number.MAX_SAFE_INTEGER;

              const second = b?.deadline
                ? new Date(
                    b.deadline
                  ).getTime()
                : Number.MAX_SAFE_INTEGER;

              return first - second;
            })
            .slice(0, 3);

        if (isMounted) {
          setFeaturedOpportunities(
            sorted
          );
        }
      } catch (error) {
        console.error(
          "Failed to load homepage opportunities:",
          error
        );

        if (isMounted) {
          setFeaturedOpportunities([]);
        }
      } finally {
        if (isMounted) {
          setOpportunitiesLoading(false);
        }
      }
    };

    loadOpportunities();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <header className="home-navbar">
        <Link
          to="/"
          className="home-brand"
          aria-label="CampusLaunch home"
        >
          <span className="home-brand-mark">
            CL
          </span>

          <span className="home-brand-name">
            CampusLaunch
          </span>
        </Link>

        <nav
          className="home-nav-links"
          aria-label="Main navigation"
        >
          <a href="#opportunities">
            Opportunities
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#why-campuslaunch">
            Why CampusLaunch
          </a>
        </nav>

        <div className="home-nav-actions">
          <Link
            to="/auth"
            className="home-signin"
          >
            Sign in
          </Link>

          <Link
            to="/auth"
            className="home-get-started"
          >
            <span>Get started</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main>
        {/* ===================================================
            HERO
            =================================================== */}

        <section
          className="home-hero"
          aria-labelledby="home-hero-title"
        >
          <div className="home-hero-content">
            <div className="home-hero-eyebrow">
              <span
                className="home-live-dot"
                aria-hidden="true"
              />

              <span>
                One space for your next opportunity
              </span>
            </div>

            <h1 id="home-hero-title">
              Find what fits.
              <br />

              <span>
                Track what matters.
              </span>
            </h1>

            <p>
              CampusLaunch brings internships,
              hackathons, certifications,
              workshops and other student
              opportunities into one personalized
              space.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/auth"
                className="home-primary-button"
              >
                <span>
                  Start exploring
                </span>

                <ArrowRight size={18} />
              </Link>

              <a
                href="#how-it-works"
                className="home-secondary-button"
              >
                <span>
                  See how it works
                </span>

                <ChevronRight size={17} />
              </a>
            </div>

            <div className="home-hero-trust">
              <div className="home-trust-item">
                <CheckCircle2
                  size={16}
                  aria-hidden="true"
                />

                <span>
                  Personalized discovery
                </span>
              </div>

              <div className="home-trust-item">
                <CheckCircle2
                  size={16}
                  aria-hidden="true"
                />

                <span>
                  Application tracking
                </span>
              </div>

              <div className="home-trust-item">
                <CheckCircle2
                  size={16}
                  aria-hidden="true"
                />

                <span>
                  Deadline intelligence
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              HERO OPPORTUNITY PANEL
              ================================================= */}

          <div
            className="home-hero-visual"
            aria-hidden="true"
          >
            <div className="home-orbit home-orbit-a" />
            <div className="home-orbit home-orbit-b" />

            <div className="home-opportunity-panel">
              <div className="home-panel-header">
                <div>
                  <span className="home-panel-label">
                    YOUR OPPORTUNITY SPACE
                  </span>

                  <h3>
                    Latest opportunities
                  </h3>
                </div>

                <div className="home-panel-avatar">
                  CL
                </div>
              </div>

              {/* Live opportunity banner */}

              <div className="home-match-banner">
                <div className="home-match-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>
                    {opportunitiesLoading
                      ? "Finding opportunities..."
                      : `${featuredOpportunities.length} live opportunities`}
                  </strong>

                  <span>
                    Updated from the CampusLaunch opportunity feed
                  </span>
                </div>
              </div>

              {/* Real opportunities */}

              {opportunitiesLoading ? (
                <>
                  <div className="home-mini-opportunity">
                    <div className="home-mini-icon purple">
                      <BriefcaseBusiness size={17} />
                    </div>

                    <div className="home-mini-content">
                      <strong>
                        Loading opportunities...
                      </strong>

                      <span>
                        Fetching the latest listings
                      </span>
                    </div>
                  </div>

                  <div className="home-mini-opportunity">
                    <div className="home-mini-icon blue">
                      <Trophy size={17} />
                    </div>

                    <div className="home-mini-content">
                      <strong>
                        Please wait
                      </strong>

                      <span>
                        Connecting to CampusLaunch
                      </span>
                    </div>
                  </div>

                  <div className="home-mini-opportunity">
                    <div className="home-mini-icon green">
                      <GraduationCap size={17} />
                    </div>

                    <div className="home-mini-content">
                      <strong>
                        Live opportunity feed
                      </strong>

                      <span>
                        Loading real data
                      </span>
                    </div>
                  </div>
                </>
              ) : featuredOpportunities.length >
                0 ? (
                featuredOpportunities.map(
                  (
                    opportunity,
                    index
                  ) => {
                    const OpportunityIcon =
                      getOpportunityIcon(
                        opportunity.type
                      );

                    const color =
                      opportunityColors[
                        index %
                          opportunityColors.length
                      ];

                    return (
                      <div
                        className="home-mini-opportunity"
                        key={
                          opportunity._id ||
                          opportunity.id ||
                          `${opportunity.title}-${index}`
                        }
                      >
                        <div
                          className={`home-mini-icon ${color}`}
                        >
                          <OpportunityIcon
                            size={17}
                          />
                        </div>

                        <div className="home-mini-content">
                          <strong>
                            {opportunity.title ||
                              "Untitled opportunity"}
                          </strong>

                          <span>
                            {opportunity.mode ||
                              "Flexible"}{" "}
                            ·{" "}
                            {opportunity.type ||
                              "Opportunity"}
                          </span>
                        </div>

                        <div className="home-mini-match">
                          {formatDeadline(
                            opportunity.deadline
                          )}
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="home-mini-opportunity">
                  <div className="home-mini-icon purple">
                    <Compass size={17} />
                  </div>

                  <div className="home-mini-content">
                    <strong>
                      No current opportunities
                    </strong>

                    <span>
                      Check back soon for new listings
                    </span>
                  </div>
                </div>
              )}

              <div className="home-panel-footer">
                <span>
                  Real opportunities from your platform
                </span>

                <Bell size={15} />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            OPPORTUNITY TYPES
            =================================================== */}

        <section
          className="home-opportunity-types"
          id="opportunities"
          aria-labelledby="opportunities-title"
        >
          <div className="home-section-heading">
            <span className="home-section-kicker">
              EXPLORE
            </span>

            <h2 id="opportunities-title">
              Opportunities that move
              <br />
              your journey forward.
            </h2>

            <p>
              Discover more than just jobs. Find
              the experiences that build your next
              step.
            </p>
          </div>

          <div className="home-type-grid">
            {/* Internship */}

            <Link
              to="/auth"
              className="home-type-card"
              aria-label="Explore internships"
            >
              <div className="home-type-icon purple">
                <BriefcaseBusiness size={22} />
              </div>

              <h3>
                Internships
              </h3>

              <p>
                Find roles aligned with your
                skills, course and career interests.
              </p>

              <span>
                <span>
                  Explore internships
                </span>

                <ArrowRight size={15} />
              </span>
            </Link>

            {/* Hackathons */}

            <Link
              to="/auth"
              className="home-type-card"
              aria-label="Explore hackathons"
            >
              <div className="home-type-icon blue">
                <Trophy size={22} />
              </div>

              <h3>
                Hackathons
              </h3>

              <p>
                Discover competitions where you
                can build, compete and learn.
              </p>

              <span>
                <span>
                  Explore hackathons
                </span>

                <ArrowRight size={15} />
              </span>
            </Link>

            {/* Certifications */}

            <Link
              to="/auth"
              className="home-type-card"
              aria-label="Explore certifications"
            >
              <div className="home-type-icon green">
                <GraduationCap size={22} />
              </div>

              <h3>
                Certifications
              </h3>

              <p>
                Keep building your technical and
                professional skill set.
              </p>

              <span>
                <span>
                  Explore certifications
                </span>

                <ArrowRight size={15} />
              </span>
            </Link>

            {/* Competitions */}

            <Link
              to="/auth"
              className="home-type-card"
              aria-label="Explore competitions"
            >
              <div className="home-type-icon orange">
                <Target size={22} />
              </div>

              <h3>
                Competitions
              </h3>

              <p>
                Find challenges that turn knowledge
                into practical experience.
              </p>

              <span>
                <span>
                  Explore competitions
                </span>

                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </section>

        {/* ===================================================
            HOW IT WORKS
            =================================================== */}

        <section
          className="home-how"
          id="how-it-works"
          aria-labelledby="how-title"
        >
          <div className="home-how-heading">
            <span className="home-section-kicker">
              THE CAMPUSLAUNCH JOURNEY
            </span>

            <h2 id="how-title">
              From discovery
              <br />
              to action.
            </h2>

            <p>
              CampusLaunch is designed around the
              actual journey students go through when
              pursuing opportunities.
            </p>
          </div>

          <div className="home-journey">
            <div
              className="home-journey-line"
              aria-hidden="true"
            />

            {/* Step 01 */}

            <div className="home-journey-step">
              <div className="home-journey-number">
                01
              </div>

              <div className="home-journey-icon">
                <Compass size={21} />
              </div>

              <h3>
                Discover
              </h3>

              <p>
                Find opportunities from different
                categories in one place.
              </p>
            </div>

            {/* Step 02 */}

            <div className="home-journey-step">
              <div className="home-journey-number">
                02
              </div>

              <div className="home-journey-icon">
                <Sparkles size={21} />
              </div>

              <h3>
                Match
              </h3>

              <p>
                See opportunities relevant to your
                skills, interests and profile.
              </p>
            </div>

            {/* Step 03 */}

            <div className="home-journey-step">
              <div className="home-journey-number">
                03
              </div>

              <div className="home-journey-icon">
                <Bookmark size={21} />
              </div>

              <h3>
                Track
              </h3>

              <p>
                Save opportunities and manage every
                application from one place.
              </p>
            </div>

            {/* Step 04 */}

            <div className="home-journey-step">
              <div className="home-journey-number">
                04
              </div>

              <div className="home-journey-icon">
                <Clock3 size={21} />
              </div>

              <h3>
                Act
              </h3>

              <p>
                Get deadline intelligence so important
                opportunities don't slip away.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================
            WHY CAMPUSLAUNCH
            =================================================== */}

        <section
          className="home-why"
          id="why-campuslaunch"
          aria-labelledby="why-title"
        >
          {/* Visual */}

          <div
            className="home-why-visual"
            aria-hidden="true"
          >
            <div className="home-why-grid">
              <div className="home-grid-square" />
              <div className="home-grid-square" />
              <div className="home-grid-square" />

              <div className="home-grid-square" />

              <div className="home-grid-square active" />

              <div className="home-grid-square" />

              <div className="home-grid-square" />
              <div className="home-grid-square" />
              <div className="home-grid-square" />
            </div>

            <div className="home-why-floating-card">
              <Sparkles size={17} />

              <div>
                <strong>
                  Personalized
                </strong>

                <span>
                  Built around you
                </span>
              </div>
            </div>
          </div>

          {/* Content */}

          <div className="home-why-content">
            <span className="home-section-kicker">
              WHY CAMPUSLAUNCH
            </span>

            <h2 id="why-title">
              Not another list
              <br />
              of opportunities.
            </h2>

            <p>
              CampusLaunch is designed to help
              students move from simply seeing
              opportunities to actually acting on them.
            </p>

            <div className="home-benefit-list">
              {/* Benefit 1 */}

              <div className="home-benefit">
                <div className="home-benefit-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>
                    Personalized discovery
                  </strong>

                  <span>
                    Opportunities can be matched against
                    your profile, skills and interests.
                  </span>
                </div>
              </div>

              {/* Benefit 2 */}

              <div className="home-benefit">
                <div className="home-benefit-icon">
                  <Target size={18} />
                </div>

                <div>
                  <strong>
                    One application journey
                  </strong>

                  <span>
                    Keep interested, applied and
                    shortlisted opportunities organized.
                  </span>
                </div>
              </div>

              {/* Benefit 3 */}

              <div className="home-benefit">
                <div className="home-benefit-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <strong>
                    Deadline intelligence
                  </strong>

                  <span>
                    Know what needs attention before the
                    deadline arrives.
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/auth"
              className="home-why-button"
            >
              <span>
                Build your opportunity space
              </span>

              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ===================================================
            CTA
            =================================================== */}

        <section
          className="home-cta"
          aria-labelledby="cta-title"
        >
          <div
            className="home-cta-glow"
            aria-hidden="true"
          />

          <span className="home-section-kicker">
            READY WHEN YOU ARE
          </span>

          <h2 id="cta-title">
            Your next opportunity
            <br />
            could already be waiting.
          </h2>

          <p>
            Create your CampusLaunch space and start
            discovering opportunities built around your
            journey.
          </p>

          <Link
            to="/auth"
            className="home-cta-button"
          >
            <span>
              Get started
            </span>

            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="home-footer">
        <div className="home-footer-brand">
          <Link
            to="/"
            className="home-brand"
            aria-label="CampusLaunch home"
          >
            <span className="home-brand-mark">
              CL
            </span>

            <span className="home-brand-name">
              CampusLaunch
            </span>
          </Link>

          <p>
            Discover. Match. Track. Act.
          </p>
        </div>

        <nav
          className="home-footer-links"
          aria-label="Footer navigation"
        >
          <a href="#opportunities">
            Opportunities
          </a>

          <a href="#how-it-works">
            How it works
          </a>

          <a href="#why-campuslaunch">
            Why CampusLaunch
          </a>

          <Link to="/auth">
            Sign in
          </Link>
        </nav>

        <div className="home-footer-bottom">
          <span>
            © {new Date().getFullYear()} CampusLaunch
          </span>

          <span>
            Built for students, opportunities and
            everything in between.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;