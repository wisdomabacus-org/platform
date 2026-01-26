"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser, useAuth } from "@/hooks/use-auth";
import { useAuthModal } from "@/stores/modal-store";

interface NavLink {
    href: string;
    label: string;
}

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    navLinks: NavLink[];
}

export const MobileNav = ({ isOpen, onClose, navLinks }: MobileNavProps) => {
    const pathname = usePathname();
    const { user } = useCurrentUser();
    const { logout, isLoading: authLoading } = useAuth();
    const { onOpen: openAuthModal } = useAuthModal();

    const isActive = (path: string) => pathname === path;

    const initials = user?.parentName
        ? user.parentName.substring(0, 2).toUpperCase()
        : "U";

    return (
        <>
            {/* 1. BACKDROP OVERLAY */}
            {/* We toggle opacity and pointer-events based on isOpen */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* 2. SLIDING DRAWER */}
            {/* We translate X based on isOpen */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >

                {/* HEADER: Close & Profile/Welcome */}
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center justify-between mb-6">
                        {/* Left side of header: Context (User or Brand) */}
                        {user ? (
                            <div className="flex items-center gap-3 animate-in fade-in duration-500">
                                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-orange-600 text-white font-bold text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{user.parentName || "User"}</p>
                                    <Link
                                        href="/profile"
                                        onClick={onClose}
                                        className="text-[10px] text-orange-600 font-semibold uppercase tracking-wide hover:underline block"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                                Wisdom Abacus
                            </span>
                        )}

                        {/* Close Button - Bold & Big */}
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors -mr-2"
                        >
                            <X className="h-6 w-6 text-slate-900" strokeWidth={2.5} />
                            <span className="sr-only">Close menu</span>
                        </button>
                    </div>

                    {/* Auth Buttons (If Logged Out) - COMPACT & CLEAN */}
                    {!user && (
                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-500">
                            <Button
                                variant="outline"
                                className="w-full h-9 text-sm font-semibold border-slate-300 rounded-lg"
                                onClick={() => {
                                    onClose();
                                    openAuthModal("login");
                                }}
                            >
                                Log In
                            </Button>
                            <Button
                                className="w-full h-9 text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-none rounded-lg"
                                onClick={() => {
                                    onClose();
                                    openAuthModal("register");
                                }}
                            >
                                Join Now
                            </Button>
                        </div>
                    )}
                </div>

                <Separator className="bg-slate-100" />

                {/* MAIN NAVIGATION - Simple Text Links */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <nav className="flex flex-col space-y-6">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                style={{ animationDelay: `${idx * 50}ms` }} // Staggered animation effect
                                className={`group flex items-center justify-between text-lg transition-all duration-200 ${isOpen ? 'animate-in slide-in-from-right-4 fade-in duration-500 fill-mode-backwards' : ''
                                    } ${isActive(link.href)
                                        ? "text-orange-600 font-bold"
                                        : "text-slate-600 font-medium hover:text-slate-900"
                                    }`}
                            >
                                {link.label}
                                {/* Subtle Arrow */}
                                <ChevronRight
                                    className={`h-4 w-4 transition-all duration-200 ${isActive(link.href)
                                        ? "text-orange-600 translate-x-0 opacity-100"
                                        : "text-slate-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                        }`}
                                />
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* FOOTER: Logout */}
                {user && (
                    <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                        <button
                            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-full px-2 py-2 rounded-lg hover:bg-red-50"
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            disabled={authLoading}
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};