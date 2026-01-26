"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoModal } from "@/stores/use-demo-store";

export const CourseHero = () => {
    const { onOpen } = useDemoModal();
    return (
        <section className="relative pt-20 pb-20 bg-[#121212] overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Content Container - 75% Width */}
            <div className="w-full lg:w-[70%] mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4">
                        <Sparkles className="h-3 w-3" />
                        Admissions Open for New Batch
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                        More Than Just Math. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                            It's Brain Development.
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        Join our structured 8-level Abacus program designed to boost concentration,
                        speed, and photographic memory. Available Online & Offline.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button onClick={onOpen} size="lg" className="h-14 px-8 text-base bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-900/20">
                            Book a Free Demo Class
                        </Button>
                        <Link href="#curriculum">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-700 bg-white/5 text-slate-300 hover:text-white hover:bg-white/5">
                                View Curriculum
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
