/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export default function PrivacyPolicyPage() {
  // Helper component for consistent section styling

  return (
    <section className="py-16 bg-white">
      {/* This wrapper sets the max-width for readability, 
        matching your screenshot's style.
      */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <header className="pb-8 border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Last Updated: November 10, 2025
          </p>
        </header>

        {/* Policy Content */}
        <main className="mt-8">
          <PolicySection title="1. Introduction">
            <p>
              Welcome to Wisdom Abacus Academy ("we," "our," or "us"). We are
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our website and services, including participating in our
              online competitions and practicing mock tests.
            </p>
          </PolicySection>

          <PolicySection title="2. Information We Collect">
            <p>
              We may collect personal information that you provide to us
              directly:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Personal Identifiers:</strong> Parent's name, student's
                name, and phone number (for OTP verification).
              </li>
              <li>
                <strong>Contact Information:</strong> Phone number and email
                address (if provided via Google login or contact forms).
              </li>
              <li>
                <strong>Third-Party Login:</strong> If you log in using Google,
                we receive your name and email address from your Google account.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about your
                participation in competitions, mock test scores, and results.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Your Information">
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                To create and manage your account and verify your identity using
                OTP.
              </li>
              <li>
                To process your registration for competitions and courses.
              </li>
              <li>
                To provide and manage our services, including mock tests and
                online competitions.
              </li>
              <li>
                To display your results and rankings on public leaderboards
                (which will only include student's name and rank/score).
              </li>
              <li>
                To respond to your inquiries submitted through our contact or
                course forms.
              </li>
              <li>
                To communicate with you about competition updates, results, and
                course information.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Data Sharing and Disclosure">
            <p>
              We do not sell your personal information. We may share your
              information in the following limited circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Public Leaderboards:</strong> Your student's name,
                grade, and score/rank may be displayed publicly on our website
                following a competition.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share your phone
                number with third-party providers for the sole purpose of
                sending OTP verification messages.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required to do so by law.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="5. Data Security">
            <p>
              We implement reasonable administrative, technical, and physical
              security measures to protect your personal information from
              unauthorized access, use, or disclosure.
            </p>
          </PolicySection>

          <PolicySection title="6. Children's Privacy">
            <p>
              Our services are directed at children (students from Grade 1 to
              6). We only collect personal information about children with the
              consent of a parent or guardian, which is obtained during the
              registration process (e.g., when a parent provides their phone
              number for OTP and enters their child&apos;s name).
            </p>
          </PolicySection>

          <PolicySection title="7. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the "Last Updated" date.
            </p>
          </PolicySection>

          <PolicySection title="8. Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please visit our
              <Link
                href="/contact-us"
                className="text-primary font-medium hover:underline"
              >
                Contact Us
              </Link>
              page.
            </p>
          </PolicySection>
          <PolicySection title="11. Contact Us">
            <p>
              If you have any questions about these Terms, please contact us
              directly at:
              <a
                href="mailto:info@wisdomabacus.com"
                className="text-primary font-medium hover:underline"
              >
                info@wisdomabacus.com
              </a>
            </p>
          </PolicySection>
        </main>
      </div>
    </section>
  );
}

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h2 className="text-2xl font-display font-bold text-foreground mt-8 mb-4">
      {title}
    </h2>
    <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
  </div>
);
