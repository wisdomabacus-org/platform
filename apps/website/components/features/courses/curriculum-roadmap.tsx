import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const CurriculumRoadmap = () => {
    const levels = [
        { lvl: 1, title: "Foundation", desc: "Intro to Beads, Finger Counting, Basic Add/Sub" },
        { lvl: 2, title: "Elementary", desc: "Small Friends Concept, Speed Writing, Visualization" },
        { lvl: 3, title: "Intermediate A", desc: "Big Friends Concept, 2-Digit Calculations" },
        { lvl: 4, title: "Intermediate B", desc: "Combination Formulas, Mental Arithmetic" },
        { lvl: 5, title: "Advanced A", desc: "Multiplication Introduction, Decimal Basics" },
        { lvl: 6, title: "Advanced B", desc: "Advanced Multiplication, Division Basics" },
        { lvl: 7, title: "Grand Master A", desc: "Decimals, Roots, Negative Numbers" },
        { lvl: 8, title: "Grand Master B", desc: "Advanced Mental Calculations & Speed Mastery" },
    ];

    return (
        <section id="curriculum" className="py-20 bg-slate-50">
            {/* Content Container - 75% Width */}
            <div className="w-full lg:w-[70%] mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
                        The 8 Steps to Mastery
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Our structured curriculum ensures a systematic progression.
                        Every level concludes with an assessment and certification.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {levels.map((l) => (
                        <Card key={l.lvl} className="border-slate-200 hover:border-orange-200 hover:shadow-lg transition-all group bg-white">
                            <CardHeader className="pb-2">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 font-bold flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    {l.lvl}
                                </div>
                                <CardTitle className="text-lg font-bold text-slate-900">
                                    Level {l.lvl}: {l.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {l.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
