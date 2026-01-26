import { Zap, FileText } from "lucide-react";

interface SyllabusItem {
    topic: string;
    description?: string;
}

interface SyllabusSectionProps {
    syllabus: SyllabusItem[];
}

export const SyllabusSection = ({ syllabus }: SyllabusSectionProps) => {
    return (
        <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-orange-600" /> Syllabus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {syllabus.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-orange-200 transition-colors shadow-sm">
                        <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Zap className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-slate-900 font-semibold text-base leading-tight">{item.topic}</p>
                            <p className="text-slate-500 text-xs mt-1">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
