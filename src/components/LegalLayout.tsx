// src/components/LegalLayout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

const LegalLayout: React.FC<Props> = ({ children }) => {
  // Any header interaction on legal pages should take the user back to the main app
  const goToApp = () => {
    window.location.href = "/"; // reload root app view
  };

  return (
    <div className="tsm-app-shell">
      <Header
        activeTab="home"
        onTabChange={() => goToApp()}
        onPostClick={goToApp}
        onAccountClick={goToApp}
        userEmail={null}
        loading={false}
        isGuest={true}
        userRole={null}
        postingRole="buyer"
        onPostingRoleChange={() => {}}
      />

      <main className="tsm-main tsm-main-legal">
        <div className="tsm-legal-container">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalLayout;
