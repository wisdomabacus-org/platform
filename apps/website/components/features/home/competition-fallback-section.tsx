import Link from "next/link";
import { Trophy, ArrowRight, Bell, Sparkles, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CompetitionFallbackSection = () => {
    return (
        <section className="py-20 bg-[#121212] text-white relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full lg:w-3/4 mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: The "FOMO" (Past Winners) */}
                    <div className="space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4">
                                <Trophy className="h-3 w-3" />
                                Season 1 Concluded
                            </div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                                Champions of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                                    Mental Math
                                </span>
                            </h2>
                            <p className="text-slate-400 text-lg mt-4 max-w-md">
                                The arena is quiet for now, but the glory remains.
                                Meet the students who topped the charts in the last season.
                            </p>
                        </div>

                        {/* Mini Leaderboard Preview */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Top Performers</span>
                                <span className="text-xs font-bold text-orange-500 uppercase">Grade 4-6 Category</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { rank: 1, name: "Aditya Kumar", score: "100/100", time: "12m 30s" },
                                    { rank: 2, name: "Sia Sharma", score: "98/100", time: "11m 45s" },
                                    { rank: 3, name: "Rahul V.", score: "96/100", time: "13m 10s" },
                                ].map((winner, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-500 text-black' :
                                                i === 1 ? 'bg-slate-300 text-black' :
                                                    'bg-orange-700 text-white'
                                                }`}>
                                                {winner.rank}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{winner.name}</p>
                                                <p className="text-xs text-slate-500">Time: {winner.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-green-400">{winner.score}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                <Link href="/results" className="text-sm font-bold text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
                                    View All Results <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: The "Lead Gen" (Waitlist) */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-[#121212] rounded-3xl transform rotate-2 opacity-50" />
                        <div className="bg-white rounded-3xl p-8 md:p-10 relative shadow-2xl transform transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                                <Bell className="h-6 w-6" />
                            </div>

                            <h3 className="text-3xl font-bold text-slate-900 mb-2">
                                Don't Miss Season 2
                            </h3>
                            <p className="text-slate-600 mb-8">
                                Registration for the next National Championship opens soon.
                                Join the waitlist to get <span className="font-bold text-slate-900">Early Bird Access (20% OFF)</span>.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Your Email Address</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="parent@example.com"
                                            className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Student Grade</label>
                                    <select className="w-full h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                        <option>Select Grade...</option>
                                        <option>UKC (Pre-Junior)</option>
                                        <option>Grade 1-3 (Junior)</option>
                                        <option>Grade 4-6 (Senior)</option>
                                        <option>Grade 7-8 (Advanced)</option>
                                    </select>
                                </div>

                                <Button className="w-full h-14 text-lg font-bold bg-[#121212] hover:bg-slate-800 text-white shadow-xl mt-2">
                                    Notify Me <Sparkles className="ml-2 h-4 w-4 text-orange-500" />
                                </Button>
                            </div>

                            <p className="text-xs text-center text-slate-400 mt-6 flex items-center justify-center gap-1">
                                <TrendingUp className="h-3 w-3" /> 450+ parents already joined the waitlist
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
