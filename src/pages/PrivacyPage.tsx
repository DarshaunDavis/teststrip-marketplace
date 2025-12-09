// src/pages/PrivacyPage.tsx
import React from "react";
import LegalLayout from "../components/LegalLayout";

const PrivacyPage: React.FC = () => {
  return (
    <LegalLayout>
      <div className="tsm-legal-page">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Effective Date:</strong> December 8, 2025
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly, such as your email address and
          details you include in ads or forms, as well as technical information provided
          automatically by our hosting and Firebase services (such as device or usage data).
        </p>

        <h2>2. How We Use Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Authenticate and manage user accounts</li>
          <li>Display and manage listings on the platform</li>
          <li>Improve and protect the service, including fraud prevention</li>
          <li>Communicate with you about your account or platform updates</li>
        </ul>

        <h2>3. Sharing of Information</h2>
        <p>
          We do not sell your personal data. We may share information with trusted
          service providers (such as Firebase) who help us operate the platform, and as
          required by law or to protect our rights and users’ safety.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We use reasonable technical and organizational measures, including those
          provided by Firebase, to help protect your information. However, no system
          is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>5. Your Choices &amp; Rights</h2>
        <p>
          You may request deletion of your account, and you may choose to stop using
          the platform at any time. If you have questions about your data, you can
          contact us using the email below.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted
          on this page with an updated “Effective Date.” Continued use of the platform
          after changes are posted means you accept the updated policy.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          For questions about this Privacy Policy, contact:
          <br />
          <strong>support@teststripmarketplace.com</strong>
        </p>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPage;
