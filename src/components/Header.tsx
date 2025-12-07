// src/components/Header.tsx
import React from "react";
import type { PostingRole, UserRole } from "../types";
import logo from "../assets/logo.png";

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
}) => {
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

  return (
    <header className="tsm-header">
      <div
  className="tsm-header-brand"
  onClick={() => onTabChange("home")}
  style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
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

      <nav className="tsm-nav-links">
        <button
          className={`tsm-nav-link ${activeTab === "home" ? "tsm-nav-link-active" : ""
            }`}
          onClick={() => onTabChange("home")}
        >
          Home
        </button>
        <button className="tsm-nav-link" onClick={onPostClick}>
          Post
        </button>
        <button
          className={`tsm-nav-link ${activeTab === "messages" ? "tsm-nav-link-active" : ""
            }`}
          onClick={() => onTabChange("messages")}
        >
          Messages
        </button>
        <button className="tsm-nav-link" onClick={onAccountClick}>
          Account
        </button>

        {userRole === "admin" && (
          <button
            className={`tsm-nav-link ${activeTab === "admin" ? "tsm-nav-link-active" : ""
              }`}
            onClick={() => onTabChange("admin")}
          >
            Admin Panel
          </button>
        )}
      </nav>

      <div className="tsm-header-right">
        {/* Role switch / badge */}
        {isGuest ? (
          <div className="tsm-role-switch">
            <span className="tsm-role-label">Posting as</span>
            <select
              className="tsm-role-select"
              value={postingRole}
              onChange={(e) =>
                onPostingRoleChange(e.target.value as PostingRole)
              }
            >
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              {/* no wholesaler for guests */}
            </select>
          </div>
        ) : (
          <div className="tsm-role-badge">
            {roleLabelFromUserRole(userRole)}
          </div>
        )}

        <span className="tsm-welcome-text">
          Welcome, <strong>{displayEmail}</strong>
        </span>
        <div className="tsm-avatar-placeholder" />
      </div>
    </header>
  );
};

export default Header;
