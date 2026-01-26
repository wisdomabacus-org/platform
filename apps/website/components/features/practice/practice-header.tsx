import { BrainCircuit } from "lucide-react";

export const PracticeHeader = () => {
    return (
        <div className="border-b border-slate-100 py-12 bg-slate-50/50">
            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                    <BrainCircuit className="h-4 w-4 text-orange-500" />
                    Training Dojo
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold text-[#121212] mb-3">
                    Practice Makes Perfect
                </h1>
                <p className="text-slate-500 text-base max-w-lg mx-auto">
                    Sharpen your skills. Use the generator for daily printed drills or take online tests to simulate the exam environment.
                </p>
            </div>
        </div>
    );
};
