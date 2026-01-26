import { CheckCircle2, LucideIcon } from "lucide-react";

interface Rule {
    icon: LucideIcon;
    text: string;
}

interface RulesSectionProps {
    rules: Rule[];
}

export const RulesSection = ({ rules }: RulesSectionProps) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-orange-600" /> Requirements & Guidelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shrink-0 text-slate-500">
                            <rule.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 leading-snug">
                            {rule.text}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};
