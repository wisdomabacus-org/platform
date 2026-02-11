"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmailInput } from "@/components/features/auth/EmailInput";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { AuthDivider } from "@/components/features/auth/AuthDivider";
import { useAuthModal } from "@/stores/modal-store";
import { useAuth } from "@/hooks/use-auth";
import { validateEmail, validatePassword, AUTH_CONSTANTS } from "@/lib/constants/auth";
import { ArrowRight, Sparkles, UserPlus } from "lucide-react";
import Cookies from "js-cookie";
import { authService } from "@/services/auth.service";

export function AuthModal() {
    const { isOpen, view, onClose, setView } = useAuthModal();
    const { login, register, isLoading } = useAuth();
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

    // Form state
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Error state
    const [errors, setErrors] = React.useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    // Reset form when view changes
    React.useEffect(() => {
        setFormData({ email: "", password: "", confirmPassword: "" });
        setErrors({});
    }, [view, isOpen]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateLoginForm = (): boolean => {
        const newErrors: typeof errors = {};
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) newErrors.email = emailValidation.error;
        if (!formData.password) newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegisterForm = (): boolean => {
        const newErrors: typeof errors = {};
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) newErrors.email = emailValidation.error;

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) newErrors.password = passwordValidation.errors[0];

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (view === "login") {
                if (!validateLoginForm()) return;
                await login({ email: formData.email, password: formData.password });
                onClose();
            } else {
                if (!validateRegisterForm()) return;
                const referralCode = Cookies.get("referral_code");
                await register({
                    email: formData.email,
                    password: formData.password,
                    referralCode,
                });
                // Switch to login view after successful registration
                setView("login");
            }
        } catch (error) {
            // Error is handled by the mutation's onError callback (toast)
            console.error("Auth error:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            // Store current URL to return to after auth
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('auth_return_url', window.location.pathname);
            }
            // Use Supabase native OAuth
            await authService.loginWithGoogle();
        } catch (error) {
            console.error("Google sign in error:", error);
            setIsGoogleLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white">
                <DialogHeader className="pt-8 px-8 pb-0 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm bg-orange-50 text-orange-600'}`}>
                        {view === 'login' ? <Sparkles className="h-6 w-6 text-orange-600" /> : <UserPlus className="h-6 w-6 text-orange-600" />}
                    </div>
                    <DialogTitle className="text-2xl font-display font-bold text-slate-900">
                        {view === 'login' ? 'Welcome Back' : 'Create Account'}
                    </DialogTitle>
                    <p className="text-slate-500 text-sm mt-2">
                        {view === 'login'
                            ? 'Enter your credentials to access your account'
                            : 'Join Wisdom Abacus Academy today'}
                    </p>
                </DialogHeader>

                <div className="px-8 pb-8 pt-6">
                    <Button
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isGoogleLoading}
                        className="w-full h-11 font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all mb-6"
                    >
                        {isGoogleLoading ? (
                            <Spinner className="mr-2 h-4 w-4" />
                        ) : (
                            <div className="relative h-5 w-5 mr-3">
                                <Image
                                    src="/search.png"
                                    alt="Google"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                        {view === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                    </Button>

                    <AuthDivider />

                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <EmailInput
                            id="email"
                            label="Email"
                            value={formData.email}
                            onChange={(val) => handleChange("email", val)}
                            error={errors.email}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            id="password"
                            label="Password"
                            value={formData.password}
                            onChange={(val) => handleChange("password", val)}
                            error={errors.password}
                            disabled={isLoading}
                        />

                        {view === 'register' && (
                            <PasswordInput
                                id="confirmPassword"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(val) => handleChange("confirmPassword", val)}
                                error={errors.confirmPassword}
                                disabled={isLoading}
                                placeholder="Re-enter your password"
                            />
                        )}

                        {view === 'login' && (
                            <div className="flex justify-end">
                                <Link 
                                    href={AUTH_CONSTANTS.ROUTES.FORGOT_PASSWORD}
                                    onClick={onClose}
                                    className="text-xs text-slate-500 hover:text-orange-600 h-auto font-medium"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50 transition-all mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner className="mr-2 h-4 w-4 text-white" />
                                    {view === 'login' ? 'Verifying...' : 'Creating Account...'}
                                </>
                            ) : (
                                <span className="flex items-center">
                                    {view === 'login' ? 'Login' : 'Create Account'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        {view === 'login' ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button
                                    onClick={() => setView('register')}
                                    className="font-bold text-slate-900 hover:text-orange-600 transition-colors"
                                >
                                    Create account
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setView('login')}
                                    className="font-bold text-slate-900 hover:text-orange-600 transition-colors"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
