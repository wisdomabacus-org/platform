import Link from "next/link";
import { Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
    return (
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-white">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

            <div className="w-full max-w-5xl mx-auto px-4 text-center">

                {/* Announcement Badge - TRUST ANCHOR */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="h-4 w-4 fill-orange-500" />
                    <span className="font-bold text-xs tracking-wide uppercase">
                        Celebrating 12 Years of Excellence
                    </span>
                </div>

                <h1 className="font-display text-5xl md:text-7xl font-bold text-[#121212] leading-[1.1] mb-6 tracking-tight">
                    A Legacy of Trust. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                        Now on Our Own Platform.
                    </span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10">
                    After empowering students offline and online for <strong>12 years</strong>, Wisdom Abacus Academy
                    is proud to launch its <strong>Official Competition Platform</strong>.
                    Experience the same expert curriculum, now with cutting-edge technology.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/competitions">
                        <Button size="lg" className="h-14 px-10 text-lg bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-200 rounded-full transition-all hover:scale-105">
                            Register for Championship
                        </Button>
                    </Link>
                    <Link href="/courses">
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-200 text-[#121212] hover:bg-slate-50 rounded-full">
                            Explore Curriculum
                        </Button>
                    </Link>
                </div>

                {/* Mini Social Proof */}
                <div className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-500">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden">
                                <Users className="h-4 w-4 text-slate-400" />
                            </div>
                        ))}
                    </div>
                    <p><strong>5,000+</strong> Students trained over 12 Years</p>
                </div>
            </div>
        </section>
    );
}
