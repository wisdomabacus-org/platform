"use client";

import {
    Zap,
    BrainCircuit,
    Trophy,
    Layers,
    Lock,
    Timer,
    Hash,
    Play,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStartExam } from "@/hooks/use-exam";
import type { MockTest } from "@/types/mock-test";

export const MockTestCard = ({ test }: { test: MockTest }) => {
    const { mutate: startExam, isPending: isStartingExam } = useStartExam();

    // For now, consider isFree tests as unlocked, paid tests as locked
    const isLocked = !test.isFree;

    const renderIcon = () => {
        if (test.title.includes("Speed")) return <Zap className="h-5 w-5 text-blue-600" />;
        if (test.title.includes("Accuracy")) return <BrainCircuit className="h-5 w-5 text-purple-600" />;
        if (test.title.includes("Simulator") || test.title.includes("Championship")) return <Trophy className="h-5 w-5 text-orange-600" />;
        return <Layers className="h-5 w-5 text-green-600" />;
    };

    const handleStartPractice = () => {
        startExam({
            examId: test.id,
            examType: 'mock-test'
        });
    };

    const getDifficultyLabel = () => {
        if (!test.difficulty) return "Practice";
        return test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1);
    };

    return (
        <Card
            className={`
            relative py-0 flex flex-col justify-between border transition-all duration-300 group overflow-hidden
            ${isLocked
                    ? 'bg-slate-50/80 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1'
                }
        `}
        >
            <CardContent className="p-6">

                {/* Header Row */}
                <div className="flex justify-between items-start mb-5">
                    <div className={`
              h-12 w-12 rounded-xl flex items-center justify-center border transition-colors
              ${isLocked
                            ? 'bg-slate-100 border-slate-200'
                            : 'bg-white border-slate-100 shadow-sm group-hover:border-orange-100 group-hover:bg-orange-50/30'
                        }
           `}>
                        {isLocked ? <Lock className="h-5 w-5 text-slate-400" /> : renderIcon()}
                    </div>

                    <Badge variant="outline" className={`font-semibold ${isLocked ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white text-slate-700 border-slate-200'}`}>
                        {getDifficultyLabel()}
                    </Badge>
                </div>

                <div className="mb-6">
                    <h3 className={`font-display font-bold text-lg mb-2 leading-tight ${isLocked ? 'text-slate-500' : 'text-[#121212] group-hover:text-orange-600 transition-colors'}`}>
                        {test.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                        {test.description || "Practice test to improve your skills"}
                    </p>
                </div>

                <div className="h-px w-full bg-slate-100 mb-4" />

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <Timer className="h-3.5 w-3.5 text-slate-400" />
                        {test.duration} Mins
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-slate-400" />
                        {test.totalQuestions} Qs
                    </div>
                </div>

            </CardContent>

            <div className="p-6 pt-0 mt-auto">
                {isLocked ? (
                    <Button variant="outline" className="w-full border-slate-200 text-slate-400 bg-transparent hover:bg-transparent cursor-not-allowed" disabled>
                        <Lock className="mr-2 h-3.5 w-3.5" /> Unlock Test
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-[#121212] text-white border-0 hover:bg-orange-600 shadow-md transition-all duration-300 font-bold group-hover:shadow-orange-200 disabled:opacity-50"
                        onClick={handleStartPractice}
                        disabled={isStartingExam}
                    >
                        {isStartingExam ? (
                            <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                Start Practice <Play className="ml-2 h-3.5 w-3.5 fill-current" />
                            </>
                        )}
                    </Button>
                )}
            </div>
        </Card>
    );
};
