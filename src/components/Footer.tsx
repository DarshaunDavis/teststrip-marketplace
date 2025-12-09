// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="tsm-footer">
      <span>© {year} Test Strip Marketplace</span>
      <nav className="tsm-footer-links" aria-label="Legal and Support">
        <a href="/privacy" className="tsm-footer-link">
          Privacy Policy
        </a>
        <a href="/terms" className="tsm-footer-link">
          Terms of Service
        </a>
        <a href="/contact" className="tsm-footer-link">
          Contact
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
