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
    Loader2,
    LogIn,
    CheckCircle2,
    RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStartExam } from "@/hooks/use-exam";
import { useAuthModal } from "@/stores/modal-store";
import { useAuthStore } from "@/stores/auth-store";
import { mockTestsService, type MockTestAttempt } from "@/services/mock-tests.service";
import type { MockTest } from "@/types/mock-test";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const MockTestCard = ({ test }: { test: MockTest }) => {
    const { mutate: startExam, isPending: isStartingExam } = useStartExam();
    const { isAuthenticated, user } = useAuthStore();
    const { onOpen: openAuthModal } = useAuthModal();

    const [attemptState, setAttemptState] = useState<{
        hasAttempted: boolean;
        inProgress: boolean;
        attempt?: MockTestAttempt;
        isChecking: boolean;
    }>({ hasAttempted: false, inProgress: false, isChecking: false });

    // Use the is_locked field from the database
    const isLocked = test.isLocked;

    // Grade filtering: hide card if user's grade is outside the test's grade range
    const userGrade = user?.studentGrade;
    const isGradeMismatch =
        isAuthenticated &&
        userGrade !== undefined &&
        userGrade !== null &&
        (userGrade < test.minGrade || userGrade > test.maxGrade);

    // Check if user has already attempted this test
    useEffect(() => {
        if (!isAuthenticated) return;

        let cancelled = false;
        setAttemptState(prev => ({ ...prev, isChecking: true }));

        mockTestsService.checkAttempt(test.id).then((result) => {
            if (!cancelled) {
                setAttemptState({
                    hasAttempted: result.hasAttempted,
                    inProgress: result.inProgress,
                    attempt: result.attempt,
                    isChecking: false,
                });
            }
        }).catch(() => {
            if (!cancelled) {
                setAttemptState(prev => ({ ...prev, isChecking: false }));
            }
        });

        return () => { cancelled = true; };
    }, [isAuthenticated, test.id]);

    // Don't render the card if grades don't match
    if (isGradeMismatch) {
        return null;
    }

    const renderIcon = () => {
        if (test.title.includes("Speed")) return <Zap className="h-5 w-5 text-blue-600" />;
        if (test.title.includes("Accuracy")) return <BrainCircuit className="h-5 w-5 text-purple-600" />;
        if (test.title.includes("Simulator") || test.title.includes("Championship")) return <Trophy className="h-5 w-5 text-orange-600" />;
        return <Layers className="h-5 w-5 text-green-600" />;
    };

    const handleStartPractice = () => {
        // Check if user is logged in
        if (!isAuthenticated) {
            toast.error("Please login to start the practice test", {
                action: {
                    label: "Login",
                    onClick: () => openAuthModal(),
                },
                duration: 5000,
            });
            return;
        }

        startExam({
            examId: test.id,
            examType: 'mock-test'
        });
    };

    const getDifficultyLabel = () => {
        if (!test.difficulty) return "Practice";
        return test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1);
    };

    const hasAttempted = attemptState.hasAttempted;
    const isInProgress = attemptState.inProgress;

    return (
        <Card
            className={`
            relative py-0 flex flex-col justify-between border transition-all duration-300 group overflow-hidden
            ${isLocked
                    ? 'bg-slate-50/80 border-slate-200 opacity-80'
                    : hasAttempted
                        ? 'bg-green-50/30 border-green-200/60'
                        : isInProgress
                            ? 'bg-amber-50/30 border-amber-200/60'
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
                            : hasAttempted
                                ? 'bg-green-100 border-green-200'
                                : isInProgress
                                    ? 'bg-amber-100 border-amber-200'
                                    : 'bg-white border-slate-100 shadow-sm group-hover:border-orange-100 group-hover:bg-orange-50/30'
                        }
           `}>
                        {isLocked
                            ? <Lock className="h-5 w-5 text-slate-400" />
                            : hasAttempted
                                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                                : isInProgress
                                    ? <RotateCcw className="h-5 w-5 text-amber-600" />
                                    : renderIcon()
                        }
                    </div>

                    <div className="flex items-center gap-2">
                        {hasAttempted && attemptState.attempt && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-semibold">
                                {attemptState.attempt.percentage}%
                            </Badge>
                        )}
                        {isInProgress && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-semibold">
                                In Progress
                            </Badge>
                        )}
                        <Badge variant="outline" className={`font-semibold ${isLocked ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-white text-slate-700 border-slate-200'}`}>
                            {getDifficultyLabel()}
                        </Badge>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className={`font-display font-bold text-lg mb-2 leading-tight ${isLocked ? 'text-slate-500' : hasAttempted ? 'text-green-800' : isInProgress ? 'text-amber-800' : 'text-[#121212] group-hover:text-orange-600 transition-colors'}`}>
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
                        <Lock className="mr-2 h-3.5 w-3.5" /> Locked
                    </Button>
                ) : hasAttempted ? (
                    <Button
                        variant="outline"
                        className="w-full border-green-200 text-green-700 bg-green-50 hover:bg-green-50 cursor-default"
                        disabled
                    >
                        <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                        Completed
                    </Button>
                ) : isInProgress ? (
                    <Button
                        className="w-full bg-amber-600 text-white border-0 hover:bg-amber-700 shadow-md transition-all duration-300 font-bold disabled:opacity-50"
                        onClick={handleStartPractice}
                        disabled={isStartingExam}
                    >
                        {isStartingExam ? (
                            <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                Resuming...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                Resume Practice
                            </>
                        )}
                    </Button>
                ) : !isAuthenticated ? (
                    <Button
                        className="w-full bg-[#121212] text-white border-0 hover:bg-orange-600 shadow-md transition-all duration-300 font-bold group-hover:shadow-orange-200"
                        onClick={handleStartPractice}
                    >
                        <LogIn className="mr-2 h-3.5 w-3.5" />
                        Login to Start
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-[#121212] text-white border-0 hover:bg-orange-600 shadow-md transition-all duration-300 font-bold group-hover:shadow-orange-200 disabled:opacity-50"
                        onClick={handleStartPractice}
                        disabled={isStartingExam || attemptState.isChecking}
                    >
                        {isStartingExam ? (
                            <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                Starting...
                            </>
                        ) : attemptState.isChecking ? (
                            <>
                                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                Loading...
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
