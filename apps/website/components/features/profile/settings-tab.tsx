import { ShieldCheck, CheckCircle2, Lock, Mail, KeyRound } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/auth";
import { ProfileInput, ProfileButton } from "./profile-ui";

interface SettingsTabProps {
    user: User;
}

export const SettingsTab = ({ user }: SettingsTabProps) => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <section className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Security</h3>
                        <p className="text-xs text-slate-500 font-medium">Manage your credentials</p>
                    </div>
                </div>

                {/* ✅ CONDITIONAL: GOOGLE vs EMAIL */}
                {user.authProvider === 'google' ? (
                    // GOOGLE VIEW
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                            <div className="relative h-6 w-6">
                                <Image src="/search.png" alt="Google" fill className="object-contain" />
                            </div>
                        </div>
                        <div className="space-y-1 flex-1">
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                Connected with Google
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </h4>
                            <p className="text-sm text-slate-500 font-medium">
                                {user.email}
                            </p>
                            <div className="pt-2">
                                <p className="text-xs text-slate-400 bg-white inline-block px-3 py-2 rounded-lg border border-slate-200 leading-relaxed">
                                    <Lock className="h-3 w-3 inline-block mr-1 mb-0.5" />
                                    To change your password, please manage your Google Account settings.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // EMAIL VIEW - Separated Identity + Form
                    <div className="space-y-6">

                        {/* 1. Email Identity Card */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-slate-100 text-blue-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-900">Email Account</h4>
                                    {user.emailVerified && (
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 font-medium">
                                    {user.email}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    This email is used for logging in and receiving updates.
                                </p>
                            </div>
                        </div>

                        {/* 2. Password Update Form */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-orange-500" /> Change Password
                            </h4>
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <ProfileInput label="Current Password" type="password" placeholder="••••••••" />
                                    <ProfileInput label="New Password" type="password" placeholder="••••••••" />
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <ProfileButton variant="outline" className="h-10 text-xs">Update Password</ProfileButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <div className="h-px bg-slate-100 w-full" />

            <section className="max-w-xl">
                <div className="p-5 rounded-xl bg-red-50 border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-red-900 mb-1">Delete Account</h3>
                        <p className="text-xs text-red-700/80">
                            This action is irreversible. All data will be lost.
                        </p>
                    </div>
                    <ProfileButton variant="danger" className="w-full sm:w-auto h-9 text-xs whitespace-nowrap bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm">Delete Account</ProfileButton>
                </div>
            </section>
        </div>
    );
};
