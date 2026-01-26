import React from "react";
import VerifyEmailContent from "@/components/features/auth/VerifyEmailContent";

/**
 * Email verification page wrapper
 * Wrapped in Suspense to handle useSearchParams()
 */
export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-8">
          <div className="space-y-4 animate-pulse">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}
