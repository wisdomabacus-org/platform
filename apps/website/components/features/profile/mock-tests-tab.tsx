"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Loader2, Trophy, BarChart3 } from "lucide-react";
import { User } from "@/types/auth";
import { mockTestsService, type MockTestAttempt } from "@/services/mock-tests.service";
import { createClient } from "@/lib/supabase/client";

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

interface MockTestsTabProps {
    user: User;
}

interface MockTestWithDetails extends MockTestAttempt {
    mockTestTitle?: string;
}

export const MockTestsTab = ({ user }: MockTestsTabProps) => {
    // Fetch user's mock test attempts with test details
    const { data: attempts, isLoading } = useQuery({
        queryKey: ["user-mock-tests", user.id],
        queryFn: async () => {
            const supabase = createClient();

            // Fetch submissions for mock tests
            const { data: submissions, error } = await supabase
                .from("submissions")
                .select(`
                    id,
                    status,
                    score,
                    total_questions,
                    submitted_at,
                    mock_test_id,
                    mock_tests (
                        id,
                        title
                    )
                `)
                .eq("user_id", user.id)
                .eq("exam_type", "mock-test")
                .in("status", ["completed", "auto-submitted"])
                .order("submitted_at", { ascending: false });

            if (error) {
                console.error("Error fetching mock test attempts:", error);
                return [];
            }

            return (submissions || []).map((sub: any) => {
                const totalMarks = sub.total_questions || 0;
                const score = sub.score || 0;
                return {
                    id: sub.id,
                    mockTestId: sub.mock_test_id,
                    submissionId: sub.id,
                    score,
                    totalMarks,
                    percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
                    submittedAt: sub.submitted_at || "",
                    mockTestTitle: sub.mock_tests?.title || "Mock Test",
                } as MockTestWithDetails;
            });
        },
        enabled: !!user.id,
    });

    const getScoreBadge = (percentage: number) => {
        if (percentage >= 80) return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" };
        if (percentage >= 60) return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
        if (percentage >= 40) return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" };
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Mock Test Results</h3>
                    <p className="text-sm text-slate-500">Your practice test history and scores.</p>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    Total: {attempts?.length || 0}
                </span>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
                    <p className="text-slate-500">Loading your mock test results...</p>
                </div>
            ) : attempts && attempts.length > 0 ? (
                <div className="space-y-4">
                    {attempts.map((attempt) => {
                        const scoreStyle = getScoreBadge(attempt.percentage);
                        return (
                            <div
                                key={attempt.id}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                                        <BookOpen className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">
                                            {(attempt as MockTestWithDetails).mockTestTitle}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {attempt.submittedAt ? formatDate(attempt.submittedAt) : "N/A"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BarChart3 className="h-3.5 w-3.5" />
                                                {attempt.score}/{attempt.totalMarks}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1.5 text-sm font-bold rounded-full ${scoreStyle.bg} ${scoreStyle.text} border ${scoreStyle.border}`}>
                                        {attempt.percentage}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No mock tests attempted yet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                        Take a practice test to see your results here.
                    </p>
                    <a
                        href="/practice"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Browse Practice Tests
                    </a>
                </div>
            )}
        </div>
    );
};
