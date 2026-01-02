import { useEffect, useRef, useState } from "react";
import { signOut } from "../lib/supabase";

function Navbar({ user, isTrialMode = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("sb-token");
    window.location.reload();
  };

  useEffect(() => {
    if (isTrialMode) return;
    
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isTrialMode]);

  const avatarLabel = (user?.email || "U").charAt(0).toUpperCase();

  return (
    <nav className="navbar-main">
      <div className="navbar-wrapper">
        <div className="flex justify-between items-center">
          <a href="/" className="navbar-brand">
            <span className="brand-badge" aria-hidden="true">
              S
            </span>
            <span className="brand-text">
              Summer<span className="brand-accent">Ease</span>
            </span>
          </a>
          {!isTrialMode && user && (
            <div className="relative" ref={menuRef}>
              <button
                className="profile-avatar"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {avatarLabel}
              </button>
              {menuOpen && (
                <div
                  className="profile-dropdown"
                  role="menu"
                  aria-label="Account menu"
                >
                  <div className="dropdown-pointer" />

                  <div className="profile-info">
                    <div className="profile-info-avatar">{avatarLabel}</div>
                    <div className="profile-info-text">
                      <p className="profile-email">{user.email}</p>
                      <p className="profile-status">Signed in</p>
                    </div>
                  </div>

                  <div className="profile-divider" />

                  <button
                    onClick={handleSignOut}
                    className="signout-button"
                    role="menuitem"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="signout-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9l3-3m0 0l3 3m-3-3v12"
                      />
                    </svg>
                    <span className="signout-text">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
