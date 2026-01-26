"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, XCircle, AlertCircle, Mail } from "lucide-react";
import { AUTH_CONSTANTS } from "@/lib/constants/auth";
import { useAuth } from "@/hooks/use-auth";

type VerificationState =
  | "verifying"
  | "success"
  | "error"
  | "expired"
  | "resend";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerification, isLoading } = useAuth();
  const [state, setState] = React.useState<VerificationState>("verifying");
  const [countdown, setCountdown] = React.useState(5);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Define verifyToken with useCallback
  const verifyToken = React.useCallback(
    async (token: string) => {
      try {
        await verifyEmail(token);
        setState("success");
      } catch (error: any) {
        if (error.message?.includes("expired")) {
          setState("expired");
        } else {
          setState("error");
        }
      }
    },
    [verifyEmail]
  );

  // Verify token on mount
  React.useEffect(() => {
    if (!token) {
      setState("resend");
      return;
    }
    verifyToken(token);
  }, [token, verifyToken]);

  // Auto-redirect countdown after success
  React.useEffect(() => {
    if (state === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (state === "success" && countdown === 0) {
      router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
    }
  }, [state, countdown, router]);

  // Resend verification email
  const handleResendEmail = React.useCallback(() => {
    if (!email) return;
    resendVerification(email);
  }, [email, resendVerification]);

  // Helper for Icon wrapper
  const renderIcon = (icon: React.ReactNode, bgColor: string, textColor: string) => (
    <div className={`flex h-16 w-16 items-center justify-center rounded-full mb-4 shadow-sm ${bgColor} ${textColor}`}>
      {icon}
    </div>
  );

  // Render content based on state
  const renderContent = () => {
    switch (state) {
      case "verifying":
        return (
          <>
            {renderIcon(<Spinner className="h-8 w-8" />, "bg-orange-50", "text-orange-600")}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Verifying Email
              </h2>
              <p className="text-slate-500 text-sm">
                Please wait while we verify your email address...
              </p>
            </div>
          </>
        );

      case "success":
        return (
          <>
            {renderIcon(<CheckCircle2 className="h-8 w-8" />, "bg-green-50", "text-green-600")}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Email Verified!
              </h2>
              <p className="text-slate-500 text-sm">
                Your email has been successfully verified. You can now login to your account.
              </p>
              <p className="text-xs text-orange-600 font-medium pt-2">
                Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
              </p>
            </div>
            <div className="w-full pt-6">
              <Button
                className="w-full h-12 font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg"
                onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
              >
                Continue to Login
              </Button>
            </div>
          </>
        );

      case "error":
      case "expired":
        return (
          <>
            {renderIcon(<XCircle className="h-8 w-8" />, "bg-red-50", "text-red-600")}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Verification Failed
              </h2>
              <p className="text-slate-500 text-sm">
                {state === "expired"
                  ? "This verification link has expired. Please request a new one."
                  : "This verification link is invalid or has already been used."}
              </p>
            </div>
            <div className="w-full space-y-3 pt-6">
              {email && (
                <Button
                  className="w-full h-12 font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg"
                  onClick={handleResendEmail}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
              )}
              <Button variant="outline" className="w-full h-12 font-semibold border-slate-200 text-slate-600 hover:text-slate-900" asChild>
                <Link href={AUTH_CONSTANTS.ROUTES.REGISTER}>
                  Back to Register
                </Link>
              </Button>
            </div>
          </>
        );

      case "resend":
        return (
          <>
            {renderIcon(<Mail className="h-8 w-8" />, "bg-orange-50", "text-orange-600")}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Verification Required
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                We have sent a verification link to your email. <br />
                Please check your inbox (and spam folder).
              </p>
            </div>
            <div className="w-full space-y-3 pt-6">
              <Button variant="outline" className="w-full h-12 font-semibold border-slate-200 text-slate-600 hover:text-slate-900" asChild>
                <Link href={AUTH_CONSTANTS.ROUTES.LOGIN}>Back to Login</Link>
              </Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-0 py-0 shadow-md bg-white rounded-2xl overflow-hidden py-0">
        <CardContent className="flex flex-col items-center space-y-4 p-10 text-center">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}