"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { EmailInput } from "@/components/features/auth/EmailInput";
import { ArrowLeft, Mail, CheckCircle2, KeyRound } from "lucide-react";
import { validateEmail, AUTH_CONSTANTS } from "@/lib/constants/auth";
import { useAuth } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | undefined>();
  const [emailSent, setEmailSent] = React.useState(false);

  // Handle input change
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError(undefined);
    }
  };

  // Validate email
  const validateForm = (): boolean => {
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    forgotPassword(email);
    setEmailSent(true);
  };

  // Resend email
  const handleResend = async () => {
    forgotPassword(email);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-0.5 py-0 shadow-md bg-white rounded-2xl overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 pb-6 px-8">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm ${emailSent ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
            {emailSent ? <CheckCircle2 className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <CardTitle className="text-2xl font-display font-bold text-slate-900">
            {emailSent ? "Check your email" : "Forgot password?"}
          </CardTitle>
          <CardDescription className="text-slate-500 text-sm">
            {emailSent
              ? "We have sent a password reset link to"
              : "No worries, we'll send you reset instructions"}
          </CardDescription>
          {emailSent && (
            <p className="text-slate-900 font-bold text-sm">{email}</p>
          )}
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          {!emailSent ? (
            // Email Input Form
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                <EmailInput
                  id="email"
                  label="Email Address"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="parent@example.com"
                  error={emailError}
                  disabled={isLoading}
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 text-white" />
                      Sending Link...
                    </>
                  ) : (
                    <span className="flex items-center">
                      Send Reset Link <Mail className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href={AUTH_CONSTANTS.ROUTES.LOGIN}
                  className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            // Success State
            <div className="space-y-6">

              <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Didn't receive the email? Check your spam folder or try resending the link.
                  <br />
                  The link expires in <span className="font-bold text-slate-700">1 hour</span>.
                </p>
              </div>

              <div className="space-y-3">
                {/* Resend Button */}
                <Button
                  variant="outline"
                  className="w-full h-12 font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : (
                    "Click to Resend"
                  )}
                </Button>

                {/* Back to Login */}
                <Link href={AUTH_CONSTANTS.ROUTES.LOGIN} className="block w-full">
                  <Button variant="ghost" className="w-full h-12 font-semibold text-slate-500 hover:text-slate-900 hover:bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}