// src/components/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import type { PostingRole, UserRole } from "../types";
import logo from "../assets/logo.png";

type HeaderNavMode = "app" | "site";
type SiteActive = "directory" | "marketplace" | null;

interface HeaderProps {
  activeTab: "home" | "sell" | "messages" | "admin";
  onTabChange: (tab: "home" | "sell" | "messages" | "admin") => void;
  onPostClick: () => void;
  onAccountClick: () => void;
  userEmail: string | null;
  loading: boolean;

  isGuest: boolean;
  userRole: UserRole | null;
  postingRole: PostingRole;
  onPostingRoleChange: (role: PostingRole) => void;

  // ✅ Minimal additions for funnel pages
  navMode?: HeaderNavMode; // default: "app"
  siteActive?: SiteActive; // only used when navMode === "site"
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onPostClick,
  onAccountClick,
  userEmail,
  loading,
  isGuest,
  userRole,
  postingRole,
  onPostingRoleChange,
  navMode = "app",
  siteActive = null,
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);

  const displayEmail = loading ? "…" : userEmail ?? "Guest";

  const roleLabelFromUserRole = (r: UserRole | null): string => {
    if (!r) return "Guest (seller default)";
    switch (r) {
      case "seller":
        return "Seller";
      case "buyer":
        return "Buyer";
      case "wholesaler":
        return "Wholesaler";
      case "admin":
        return "Admin";
      case "moderator":
        return "Moderator";
      default:
        return "Seller";
    }
  };

  // ✅ Logo should always route to funnel home (/)
  const handleLogoClick = () => {
    if (window.location.pathname !== "/") {
      window.location.href = "/";
      return;
    }
    onTabChange("home");
    setMobileNavOpen(false);
  };

  const handleNavHome = () => {
    onTabChange("home");
    setMobileNavOpen(false);
  };

  const handleNavMessages = () => {
    onTabChange("messages");
    setMobileNavOpen(false);
  };

  const handleNavAdmin = () => {
    onTabChange("admin");
    setMobileNavOpen(false);
  };

  const handleNavPost = () => {
    onPostClick();
    setMobileNavOpen(false);
  };

  const handleNavAccount = () => {
    onAccountClick();
    setMobileNavOpen(false);
  };

  const go = (path: string) => {
    window.location.href = path;
    setMobileNavOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!mobileNavOpen) return;

      const menu = mobileNavRef.current;
      const toggle = mobileToggleRef.current;
      const target = e.target as Node | null;

      if (!target) return;
      if (menu && menu.contains(target)) return;
      if (toggle && toggle.contains(target)) return;

      setMobileNavOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileNavOpen]);

  return (
    <>
      <header className="tsm-header">
        <div
          className="tsm-header-brand"
          onClick={handleLogoClick}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <img
            src={logo}
            alt="Test Strip Marketplace logo"
            style={{
              height: "50px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Desktop nav */}
        <nav className="tsm-nav-links tsm-nav-desktop">
          {navMode === "site" ? (
            <>
              <button
                className={`tsm-nav-link ${
                  siteActive === "directory" ? "tsm-nav-link-active" : ""
                }`}
                onClick={() => go("/directory")}
              >
                Directory
              </button>
              <button
                className={`tsm-nav-link ${
                  siteActive === "marketplace" ? "tsm-nav-link-active" : ""
                }`}
                onClick={() => go("/marketplace")}
              >
                Marketplace
              </button>
            </>
          ) : (
            <>
              <button
                className={`tsm-nav-link ${
                  activeTab === "home" ? "tsm-nav-link-active" : ""
                }`}
                onClick={handleNavHome}
              >
                Home
              </button>
              <button className="tsm-nav-link" onClick={handleNavPost}>
                Post
              </button>
              <button
                className={`tsm-nav-link ${
                  activeTab === "messages" ? "tsm-nav-link-active" : ""
                }`}
                onClick={handleNavMessages}
              >
                Messages
              </button>
              <button className="tsm-nav-link" onClick={handleNavAccount}>
                Account
              </button>

              {userRole === "admin" && (
                <button
                  className={`tsm-nav-link ${
                    activeTab === "admin" ? "tsm-nav-link-active" : ""
                  }`}
                  onClick={handleNavAdmin}
                >
                  Admin Panel
                </button>
              )}
            </>
          )}
        </nav>

        <div className="tsm-header-right">
          <button
            type="button"
            className="tsm-mobile-menu-toggle"
            ref={mobileToggleRef}
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            <span className="tsm-mobile-menu-toggle-icon">
              {mobileNavOpen ? "✕" : "☰"}
            </span>
          </button>

          {isGuest ? (
            <div className="tsm-role-switch">
              <span className="tsm-role-label">Posting as</span>
              <select
                className="tsm-role-select"
                value={postingRole}
                onChange={(e) => onPostingRoleChange(e.target.value as PostingRole)}
              >
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
          ) : (
            <div className="tsm-role-badge">{roleLabelFromUserRole(userRole)}</div>
          )}

          <span className="tsm-welcome-text">
            Welcome, <strong>{displayEmail}</strong>
          </span>

          <div className="tsm-avatar-placeholder" />
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div className="tsm-mobile-nav" ref={mobileNavRef}>
          {navMode === "site" ? (
            <>
              <button
                className={`tsm-mobile-nav-link ${
                  siteActive === "directory" ? "tsm-nav-link-active" : ""
                }`}
                onClick={() => go("/directory")}
              >
                Directory
              </button>
              <button
                className={`tsm-mobile-nav-link ${
                  siteActive === "marketplace" ? "tsm-nav-link-active" : ""
                }`}
                onClick={() => go("/marketplace")}
              >
                Marketplace
              </button>
            </>
          ) : (
            <>
              <button className="tsm-mobile-nav-link" onClick={handleNavHome}>
                Home
              </button>
              <button className="tsm-mobile-nav-link" onClick={handleNavPost}>
                Post
              </button>
              <button className="tsm-mobile-nav-link" onClick={handleNavMessages}>
                Messages
              </button>
              <button className="tsm-mobile-nav-link" onClick={handleNavAccount}>
                Account
              </button>
              {userRole === "admin" && (
                <button className="tsm-mobile-nav-link" onClick={handleNavAdmin}>
                  Admin Panel
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
