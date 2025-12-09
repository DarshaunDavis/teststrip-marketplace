// src/pages/TermsPage.tsx
import React from "react";
import LegalLayout from "../components/LegalLayout";

const TermsPage: React.FC = () => {
  return (
    <LegalLayout>
      <div className="tsm-legal-page">
        <h1>Terms of Service</h1>
        <p>
          <strong>Effective Date:</strong> December 8, 2025
        </p>

        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing or using Test Strip Marketplace, LLC (“TSM”, “we”, “our”, or “us”),
          you agree to be bound by these Terms of Service. If you do not agree, do not
          use the platform.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 18 years old and located in the United States to use this
          platform. By using the site, you represent that you meet these requirements.
        </p>

        <h2>3. Platform Purpose</h2>
        <p>
          Test Strip Marketplace is a Listing &amp; Classified Ads Platform (LISP). We do not
          buy or sell items, act as a broker, or become a party to transactions between
          users. All transactions are strictly between buyers and sellers.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>
          You are solely responsible for the content of your listings and communications,
          and for complying with all applicable laws regarding medical supplies and
          other items you choose to post.
        </p>

        <h2>5. Posting Rules</h2>
        <p>
          Users may post one free ad per day unless otherwise specified. Duplicate,
          misleading, or fraudulent ads are prohibited. We may remove ads that violate
          our rules or appear unsafe or abusive.
        </p>

        <h2>6. Admin Rights</h2>
        <p>
          We may suspend, remove, or restrict accounts and listings at our discretion,
          including for suspected fraud, abuse, or violations of these Terms.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          TSM provides the platform “as is” and “as available” without warranties of any
          kind. We are not responsible for user-to-user disputes, transactions, losses,
          or damages arising from use of the platform.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, TSM’s total liability for any claim
          related to the service will not exceed the greater of ten (10) U.S. dollars
          or the amount you paid to use the service in the twelve (12) months before
          the claim arose.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of New York, without regard
          to its conflict of law rules, unless we later specify a different state in an
          updated version of these Terms.
        </p>

        <h2>10. Contact</h2>
        <p>
          If you have questions about these Terms, you can contact us at:
          <br />
          <strong>support@teststripmarketplace.com</strong>
        </p>
      </div>
    </LegalLayout>
  );
};

export default TermsPage;
