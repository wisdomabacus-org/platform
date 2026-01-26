import Link from "next/link";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FinalCTASection = () => {
    return (
        <section className="py-[10%] bg-[#121212] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full lg:w-3/4 mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-16">

                    {/* LEFT: The Pitch to Parents */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                Limited Batches Available
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                                Ready to Transform Your <br />
                                <span className="text-orange-500">Child's Future?</span>
                            </h2>
                        </div>

                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                            You have seen the competition. You have seen the results.
                            Now, give your child the expert guidance they deserve.
                            Speak to our academic counselors today.
                        </p>

                        {/* Trust Indicators - ISO REMOVED */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                'Free Skill Assessment',
                                'Customized Learning Path',
                                'Flexible Timings (Weekend/Weekday)',
                                'Wisdom Abacus Certified'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    </div>
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <Button size="lg" className="h-14 px-8 bg-white text-[#121212] hover:bg-slate-200 font-bold text-base w-full sm:w-auto shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Book a Free Demo Class <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Link href="/courses#curriculum">
                                <Button size="lg" variant="outline" className="h-14 px-8 border-slate-700 text-slate-300 hover:text-white hover:border-white hover:bg-white/10 bg-white/5 w-full sm:w-auto">
                                    Look at Syllabus
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: The "Awesome Card" Visual */}
                    <div className="flex-1 relative w-full max-w-md flex justify-center md:justify-end perspective-1000">
                        <div className="absolute top-4 -right-4 w-full h-full bg-slate-800/50 rounded-2xl border border-slate-700 rotate-6 scale-95 -z-10 blur-[1px]" />
                        <div className="relative w-full bg-gradient-to-br from-orange-500 to-red-600 p-[2px] rounded-2xl rotate-0 hover:rotate-1 transition-transform duration-500 group cursor-pointer shadow-2xl shadow-orange-900/50">
                            <div className="bg-[#1a1a1a] rounded-xl p-8 h-full relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
                                            <BookOpen className="h-8 w-8 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-xl">Level 1 Foundation</h4>
                                            <p className="text-xs text-orange-400 font-medium uppercase tracking-wider mt-1">For Beginners (Age 5-7)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>Introduction to Abacus</span>
                                            <span>Week 1-2</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-full bg-orange-500/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>Finger Counting & Beads</span>
                                            <span>Week 3-4</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-orange-500/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-slate-700" />
                                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-slate-600" />
                                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a1a] bg-slate-500 flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
                                    </div>
                                    <span className="text-white text-sm font-bold group-hover:text-orange-400 transition-colors flex items-center gap-2">
                                        View Full Plan <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
