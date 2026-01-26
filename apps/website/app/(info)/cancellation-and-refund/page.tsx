/* eslint-disable react/no-unescaped-entities */

export default function CancellationAndRefundsPage() {
  return (
    <section className="py-16 bg-white">
      {/* Wrapper for readability */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <header className="pb-8 border-b border-gray-200">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Cancellation & Refunds Policy
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Last Updated: November 10, 2025
          </p>
        </header>

        {/* Policy Content */}
        <main className="mt-8">
          <PolicySection title="1. Overview">
            <p>
              This policy outlines the terms for cancellation and refunds
              regarding fees paid for online competition enrollments on the
              Wisdom Abacus Academy platform.
            </p>
          </PolicySection>

          <PolicySection title="2. Cancellation Policy">
            <p>
              Users may request to cancel their enrollment in any paid
              competition. To cancel, please send an email request to our
              support team with your registered phone number and the name of the
              competition.
            </p>
          </PolicySection>

          <PolicySection title="3. Refund Eligibility">
            <p>
              We follow a strict refund policy based on the registration
              deadline of each competition.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Refunds ARE Eligible:</strong> A full refund (minus any
                applicable payment gateway fees) will be processed if you
                request to cancel your enrollment *before* the registration
                deadline for that specific competition has passed.
              </li>
              <li>
                <strong>Refunds are NOT Eligible:</strong> No refunds will be
                issued for any cancellation request received *after* the
                registration for that competition has officially closed. This is
                because we finalize participant lists and operational
                arrangements at that time.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="4. How to Request a Refund">
            <p>
              To request a refund (if eligible), please email us at{" "}
              <a
                href="mailto:info@wisdomabacus.com"
                className="text-primary font-medium hover:underline"
              >
                info@wisdomabacus.com
              </a>
              . Please include "Refund Request" in the subject line.
            </p>
            <p>
              All approved refunds will be processed within 5-7 business days to
              the original method of payment.
            </p>
          </PolicySection>

          <PolicySection title="5. Contact Us">
            <p>
              If you have any questions about this policy, please contact us at:{" "}
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
