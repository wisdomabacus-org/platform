"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthModal } from "@/stores/modal-store";
import { MobileNav } from "./mobile-nav";
import { UserNav } from "./user-nav";

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated } = useAuthStore();
    const { onOpen: openAuthModal } = useAuthModal();

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/competitions", label: "Competitions" },
        { href: "/practice", label: "Practice" },
        { href: "/courses", label: "Courses" },
    ];

    const isActivePath = (path: string) => pathname === path;

    return (
        <>
            <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">

                    {/* 1. LEFT: Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group z-50">
                        <div className="relative h-8 w-8 md:h-9 md:w-9 transition-transform group-hover:scale-105">
                            <Image
                                src="/brand.png"
                                fill
                                className="object-contain"
                                alt="Wisdom Abacus"
                            />
                        </div>
                        <span className="text-lg md:text-xl font-display font-bold text-slate-900 tracking-tight">
                            Wisdom Abacus
                        </span>
                    </Link>

                    {/* 2. CENTER: Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-semibold transition-all duration-200 hover:text-orange-600 ${isActivePath(link.href)
                                    ? "text-orange-600"
                                    : "text-slate-600"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* 3. RIGHT: Auth & Mobile Trigger */}
                    <div className="flex items-center gap-3 md:gap-4">

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <UserNav />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        className="font-semibold text-slate-600 hover:text-slate-900"
                                        onClick={() => openAuthModal("login")}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className="bg-[#121212] text-white hover:bg-slate-800 shadow-md"
                                        onClick={() => openAuthModal("register")}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Trigger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden h-10 w-10 text-slate-900 hover:bg-slate-50 -mr-2 z-50 relative"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-7 w-7" strokeWidth={2} />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Custom Mobile Nav Overlay */}
            <MobileNav
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navLinks={navLinks}
            />
        </>
    );
};