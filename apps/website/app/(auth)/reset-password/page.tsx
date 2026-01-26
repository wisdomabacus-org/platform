import React from "react";
import ResetPasswordContent from "@/components/features/auth/ResetPasswordContent";

/**
 * Reset password page wrapper
 * Wrapped in Suspense to handle useSearchParams()
 */
export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border-0">
          <div className="space-y-6 animate-pulse">
            <div className="h-12 w-12 bg-slate-100 rounded-full mx-auto" />
            <div className="h-8 bg-slate-100 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-slate-100 rounded w-1/2 mx-auto" />
            <div className="space-y-4 pt-4">
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-12 bg-slate-100 rounded" />
              <div className="h-12 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </React.Suspense>
  );
}