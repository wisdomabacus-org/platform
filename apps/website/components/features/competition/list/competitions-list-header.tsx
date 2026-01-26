import { Sparkles } from "lucide-react";

export const CompetitionsListHeader = () => {
    return (
        <section className="pt-20 pb-12 bg-white">
            <div className="container mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider mb-6">
                    <Sparkles className="h-4 w-4" />
                    Registrations Open for Season 1
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6">
                    National Abacus Championship
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Compete with the best minds across India. Test your speed, accuracy,
                    and win exciting prizes.
                </p>
            </div>
        </section>
    );
};
