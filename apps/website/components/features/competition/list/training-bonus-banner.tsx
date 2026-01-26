import { Video } from "lucide-react";

export const TrainingBonusBanner = () => (
    <div className="w-full bg-gradient-to-r from-[#121212] to-slate-900 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl mb-8 group border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
                    <Video className="h-3 w-3" />
                    Exclusive Bonus
                </div>
                <div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                        Free 30-Day Crash Course included!
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base max-w-xl">
                        Every participant gets access to daily live training sessions via Zoom/Google Meet.
                        We ensure your child is exam-ready before the big day.
                    </p>
                </div>
            </div>

            {/* Visual Element */}
            <div className="flex items-center gap-6 md:border-l border-white/10 md:pl-8">
                <div className="text-center">
                    <p className="text-3xl font-bold text-white">30+</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">Live Hours</p>
                </div>
                <div className="w-px h-12 bg-white/10 hidden md:block" />
                <div className="text-center">
                    <p className="text-3xl font-bold text-white">100%</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">Free</p>
                </div>
            </div>
        </div>
    </div>
);
