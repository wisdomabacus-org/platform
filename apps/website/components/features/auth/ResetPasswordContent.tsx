"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { ShieldCheck, XCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { validatePassword, AUTH_CONSTANTS } from "@/lib/constants/auth";
import { useAuth } from "@/hooks/use-auth";

type ResetState = "validating" | "valid" | "invalid" | "success";

export default function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuth();
  const [state, setState] = React.useState<ResetState>("valid");

  const token = searchParams.get("token");

  // Form state
  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  });

  // Error state
  const [errors, setErrors] = React.useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Check if token exists on mount
  React.useEffect(() => {
    if (!token) {
      setState("invalid");
    }
  }, [token]);

  // Handle input changes
  const handleChange = (
    field: "password" | "confirmPassword",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    try {
      await resetPassword({
        token,
        password: formData.password,
      });
      setState("success");
      setTimeout(() => {
        router.push(AUTH_CONSTANTS.ROUTES.LOGIN);
      }, 2000);
    } catch (error: any) {
      if (error.message?.includes("invalid") || error.message?.includes("expired")) {
        setState("invalid");
      }
    }
  };

  // RENDER HELPERS
  const renderIcon = (icon: React.ReactNode, bgColor: string, textColor: string) => (
    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm ${bgColor} ${textColor}`}>
      {icon}
    </div>
  );

  const renderContent = () => {
    switch (state) {
      case "invalid":
        return (
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <Card className="border-0.5 py-0 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 pt-10 pb-10 px-8 text-center">
                {renderIcon(<XCircle className="h-6 w-6" />, "bg-red-50", "text-red-600")}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-slate-900">
                    Invalid Reset Link
                  </h2>
                  <p className="text-slate-500 text-sm">
                    This password reset link is invalid or has expired.
                  </p>
                  <p className="text-xs text-slate-400 pt-2">
                    Reset links expire after {AUTH_CONSTANTS.RESET_PASSWORD_LINK_EXPIRY_HOURS} hour.
                  </p>
                </div>
                <div className="w-full space-y-3 pt-4">
                  <Link href={AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD} className="block w-full">
                    <Button className="w-full h-12 font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg">
                      Request New Link
                    </Button>
                  </Link>
                  <Link href={AUTH_CONSTANTS.ROUTES.LOGIN} className="block w-full">
                    <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-600 hover:text-slate-900">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "success":
        return (
          <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
            <Card className="border-0.5 py-0 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center space-y-4 pt-10 pb-10 px-8 text-center">
                {renderIcon(<CheckCircle2 className="h-6 w-6" />, "bg-green-50", "text-green-600")}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-display text-slate-900">
                    Password Reset Successful!
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Your password has been successfully updated.
                  </p>
                  <p className="text-xs text-orange-600 font-medium pt-2 flex items-center justify-center gap-2">
                    <Spinner className="h-3 w-3" /> Redirecting to login...
                  </p>
                </div>
                <div className="w-full pt-4">
                  <Button
                    className="w-full h-12 font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                    onClick={() => router.push(AUTH_CONSTANTS.ROUTES.LOGIN)}
                  >
                    Continue to Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "valid":
      default:
        return (
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Card className="border-0.5 py-0 shadow-md bg-white rounded-2xl overflow-hidden">
              <CardHeader className="space-y-2 text-center pt-10 pb-6 px-8">
                {renderIcon(<ShieldCheck className="h-6 w-6" />, "bg-orange-50", "text-orange-600")}
                <CardTitle className="text-2xl font-display font-bold text-slate-900">
                  Reset Password
                </CardTitle>
                <CardDescription className="text-slate-500 text-sm">
                  Enter your new password below
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-10 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <PasswordInput
                      id="password"
                      label="New Password"
                      value={formData.password}
                      onChange={(value) => handleChange("password", value)}
                      placeholder="Create a strong password"
                      error={errors.password}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />

                    <PasswordInput
                      id="confirmPassword"
                      label="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={(value) => handleChange("confirmPassword", value)}
                      placeholder="Re-enter your password"
                      error={errors.confirmPassword}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4 text-white" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <Link href={AUTH_CONSTANTS.ROUTES.LOGIN}>
                    <Button variant="ghost" className="text-slate-500 hover:text-slate-900 hover:bg-transparent font-semibold">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return renderContent();
}