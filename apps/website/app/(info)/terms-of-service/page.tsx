/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

export default function TermsOfServicePage() {
  // Helper component for consistent section styling

  return (
    <section className="py-16 bg-white">
      {/* Wrapper for readability */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <header className="pb-8 border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Last Updated: November 10, 2025
          </p>
        </header>

        {/* Policy Content */}
        <main className="mt-8">
          <PolicySection title="1. Acceptance of Terms">
            <p>
              Welcome to Wisdom Abacus ("we," "our," or "us"). These Terms of
              Service ("Terms") govern your access to and use of our website,
              products, and services, including all online competitions
              [cite_start]and mock tests[cite: 1, 4]. By accessing or using our
              services, you agree to be bound by these Terms.
            </p>
          </PolicySection>

          <PolicySection title="2. User Accounts">
            <p>
              To access certain features, such as competitions or your profile,
              [cite_start]you must register for an account[cite: 7]. You agree
              to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate and complete information.</li>
              <li>
                Register using a valid mobile phone number and verify your
                [cite_start]identity via a One-Time Password (OTP)[cite: 7], or
                by using your Google account.
              </li>
              <li>
                Keep your account information confidential and be responsible
                for all activities that occur under your account.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="3. Description of Services">
            <p>Wisdom Abacus provides an online platform for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Registering for and participating in scheduled, time-bound
                [cite_start]online abacus competitions[cite: 10].
              </li>
              <li>
                [cite_start]Accessing and practicing with our collection of mock
                tests[cite: 10].
              </li>
              <li>
                [cite_start]Submitting inquiries for our offline and online
                abacus courses[cite: 7].
              </li>
              <li>
                [cite_start]Viewing your personal profile, competition history,
                and results[cite: 7].
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Payments and Fees">
            <p>
              [cite_start]We charge fees for enrollment in our "Actual
              Competitions"[cite: 10]. All payments are processed through a
              third-party payment gateway (e.g., PhonePe) [cite_start][cite:
              10]. By providing payment information, you represent that you are
              authorized to use the payment method.
            </p>
            <p>
              All fees are non-refundable unless otherwise stated by us in
              writing. Practice mock tests are provided free of charge.
            </p>
          </PolicySection>

          <PolicySection title="5. User Conduct and Responsibilities">
            <p>
              You agree to use our services only for lawful purposes. You must
              not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Engage in any activity that interferes with or disrupts the
                services.
              </li>
              <li>
                Attempt to cheat during any competition. Our system includes
                [cite_start]measures to detect such activity[cite: 9, 10].
              </li>
              <li>
                Share your account with any other person to allow them to take
                competitions or tests on your behalf.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="6. Competition Results">
            <p>
              Our system automatically grades all MCQ-based exams upon
              [cite_start]submission[cite: 10]. Results and rankings will be
              finalized by our [cite_start]staff and published on the website's
              "Result Page"[cite: 10, 13]. All published results are final.
            </p>
          </PolicySection>

          <PolicySection title="7. Intellectual Property">
            <p>
              All content on our website, including the questions in our
              competitions and mock tests, text, graphics, and logos, are the
              exclusive property of Wisdom Abacus and are protected by copyright
              and other intellectual property laws.
            </p>
          </PolicySection>

          <PolicySection title="8. Disclaimer of Warranties">
            <p>
              Our services are provided "as is" and "as available" without any
              warranties of any kind, express or implied. We do not warrant that
              the service will be uninterrupted, secure, or error-free.
            </p>
          </PolicySection>

          <PolicySection title="9. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Wisdom Abacus shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or _ revenues, whether
              incurred directly or indirectly, resulting from your access to or
              use of our services.
            </p>
          </PolicySection>

          <PolicySection title="10. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of any changes by posting the new Terms on this page
              and updating the "Last Updated" date. Your continued use of the
              service after such changes constitutes your acceptance of the new
              Terms.
            </p>
          </PolicySection>

          <PolicySection title="11. Contact Us">
            <p>
              If you have any questions about these Terms, please visit our
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
