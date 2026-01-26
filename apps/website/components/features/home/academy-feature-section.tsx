import Link from "next/link";
import { Crown, Zap, Target, Star, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AcademyFeatureSection = () => {
    return (
        <section className="py-20 bg-[#121212] text-white relative overflow-hidden">
            {/* Brand Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-900/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full lg:w-3/4 mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: The "Why Join Now" Pitch */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Crown className="h-3 w-3" />
                                Admissions Open
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                                Don't Just Wait. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                                    Start Training.
                                </span>
                            </h2>
                            <p className="text-slate-400 text-lg mt-4 max-w-md leading-relaxed">
                                The next National Championship will be tougher.
                                Join our <strong>12-Year Legacy Program</strong> today and turn your child into a calculation prodigy before the next season begins.
                            </p>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: Zap, text: "Building Speed" },
                                { icon: Target, text: "Exam Accuracy" },
                                { icon: Star, text: "Confidence Boost" },
                                { icon: Trophy, text: "Competition Ready" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-[#121212] flex items-center justify-center border border-white/10 shrink-0">
                                        <item.icon className="h-4 w-4 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-200">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Link href="/contact">
                                <Button size="lg" className="h-14 px-8 bg-white text-[#121212] hover:bg-slate-200 font-bold text-base shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                    Join the Academy <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: The "Access Card" Visual */}
                    <div className="relative perspective-1000">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl blur opacity-40" />

                        <div className="bg-[#1a1a1a] rounded-3xl p-1 relative shadow-2xl transform transition-transform hover:scale-[1.01] duration-500 border border-white/10">
                            {/* Card Content */}
                            <div className="bg-[#121212] rounded-[20px] p-8 md:p-10 h-full flex flex-col relative overflow-hidden">

                                {/* Decorative Watermark */}
                                <div className="absolute -bottom-10 -right-10 text-[200px] text-white/5 font-bold leading-none select-none">
                                    12
                                </div>

                                {/* Card Header */}
                                <div className="mb-8 relative z-10 border-b border-white/10 pb-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Membership</p>
                                            <h3 className="text-2xl font-display font-bold text-white">
                                                Student Access
                                            </h3>
                                        </div>
                                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <Crown className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Program</p>
                                            <p className="font-bold text-slate-200">Abacus Mastery</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-500 uppercase">Levels</p>
                                            <p className="font-bold text-slate-200">1 to 8</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Mode</p>
                                            <p className="font-bold text-slate-200">Online / Offline</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                            <p className="font-bold text-green-500 flex items-center gap-1 justify-end">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Open
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Barcode Visual */}
                                <div className="mt-8 relative z-10">
                                    <div className="h-8 w-full bg-white/5 rounded flex gap-1 items-center px-2 overflow-hidden opacity-50">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className={`h-full bg-white w-${Math.random() > 0.5 ? '1' : '2'} rounded-full mx-0.5`} />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-center text-slate-600 mt-2 font-mono">VALID FOR 2025 ADMISSIONS</p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
