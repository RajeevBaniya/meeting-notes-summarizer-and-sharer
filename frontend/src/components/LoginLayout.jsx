import { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import { checkTrialUsed } from "../lib/utils";

function LoginLayout({ onAuthSuccess, onTrialStart }) {
  const [trialUsed, setTrialUsed] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    setTrialUsed(checkTrialUsed());
  }, []);

  const handleTryIt = () => {
    if (onTrialStart) {
      onTrialStart();
    }
  };

  const handleShowAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthForm(true);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <a href="/" className="navbar-brand">
                <span className="brand-badge" aria-hidden="true">
                  S
                </span>
                <span className="brand-text">
                  Summer<span className="brand-accent">Ease</span>
                </span>
              </a>
            </div>
            <h1 className="hero-title">
              Stop writing.
              <br />
              <span className="hero-accent">Start summarizing.</span>
            </h1>
            <p className="hero-description">
              Upload your meeting transcript, get structured insights in
              seconds. Action items, decisions, and key points — extracted
              automatically.
            </p>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="feature-icon feature-icon-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3>Action Items</h3>
                  <p>Auto-extract tasks with assignees</p>
                </div>
              </div>
              <div className="hero-feature">
                <div className="feature-icon feature-icon-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3>Key Decisions</h3>
                  <p>Never miss what was decided</p>
                </div>
              </div>
              <div className="hero-feature">
                <div className="feature-icon feature-icon-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3>Deadlines</h3>
                  <p>Track dates and deliverables</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-header">
                <div className="visual-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="visual-title">meeting-summary.txt</span>
              </div>
              <div className="visual-content">
                <div className="visual-line visual-line-heading">
                  Team Standup - Jan 15
                </div>
                <div className="visual-line"></div>
                <div className="visual-line visual-line-short"></div>
                <div className="visual-divider"></div>
                <div className="visual-line visual-line-accent">
                  Action Items (3)
                </div>
                <div className="visual-line visual-line-indent"></div>
                <div className="visual-line visual-line-indent visual-line-short"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper">
            <div className="form-brand">
              <a href="/" className="navbar-brand">
                <span className="brand-badge" aria-hidden="true">
                  S
                </span>
                <span className="brand-text">
                  Summer<span className="brand-accent">Ease</span>
                </span>
              </a>
            </div>
            {!trialUsed ? (
              <div className={`auth-card ${showAuthForm ? 'auth-form-slide-in' : ''}`}>
                {!showAuthForm ? (
                  <>
                    <div className="auth-header">
                      <h2 className="auth-title">Try SummerEase</h2>
                      <p className="auth-subtitle">
                        Generate your first summary without signing up
                      </p>
                    </div>
                    <button
                      onClick={handleTryIt}
                      className="auth-submit"
                      type="button"
                    >
                      Try it
                    </button>
                    <div className="auth-footer">
                      <span>Want to save your summaries?</span>
                      <button
                        type="button"
                        onClick={handleShowAuth}
                        className="auth-switch"
                      >
                        Sign up
                      </button>
                    </div>
                  </>
                ) : (
                  <AuthForm onAuthSuccess={onAuthSuccess} initialMode={authMode} />
                )}
              </div>
            ) : (
              <div className={`auth-card ${showAuthForm ? 'auth-form-slide-in' : ''}`}>
                {!showAuthForm ? (
                  <>
                    <div className="auth-header">
                      <h2 className="auth-title">Trial Complete</h2>
                      <p className="auth-subtitle">
                        Your one-time trial is over. Please login to continue
                        generating summaries.
                      </p>
                    </div>
                    <div className="auth-actions">
                      <button
                        onClick={() => handleShowAuth('login')}
                        className="auth-submit"
                        type="button"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => handleShowAuth('signup')}
                        className="auth-submit auth-submit-secondary"
                        type="button"
                      >
                        Sign up
                      </button>
                    </div>
                  </>
                ) : (
                  <AuthForm onAuthSuccess={onAuthSuccess} initialMode={authMode} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginLayout;
