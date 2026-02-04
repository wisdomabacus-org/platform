"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy, Calendar, Loader2, ExternalLink } from "lucide-react";
import { User } from "@/types/auth";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Simple date formatter - avoid date-fns dependency
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

interface CompetitionsTabProps {
    user: User;
}

interface EnrolledCompetition {
    id: string;
    title: string;
    examDate: string;
    status: string;
    enrollmentStatus: string;
    slug: string;
}

export const CompetitionsTab = ({ user }: CompetitionsTabProps) => {
    // Fetch enrolled competitions with details
    const { data: enrolledCompetitions, isLoading } = useQuery({
        queryKey: ["user-competitions", user.id],
        queryFn: async () => {
            const supabase = createClient();

            // Get enrollments with competition details
            const { data: enrollments, error } = await supabase
                .from("enrollments")
                .select(`
                    id,
                    status,
                    created_at,
                    competition:competitions (
                        id,
                        title,
                        slug,
                        exam_date,
                        status,
                        is_results_published
                    )
                `)
                .eq("user_id", user.id)
                .eq("is_payment_confirmed", true)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching enrollments:", error);
                return [];
            }

            // Map to enriched format
            return (enrollments || []).map((e: any) => ({
                id: e.id,
                title: e.competition?.title || "Unknown Competition",
                examDate: e.competition?.exam_date,
                status: e.competition?.status || "upcoming",
                enrollmentStatus: e.status,
                slug: e.competition?.slug,
                isResultsPublished: e.competition?.is_results_published,
            }));
        },
        enabled: !!user.id,
    });

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            upcoming: { bg: "bg-blue-50", text: "text-blue-700", label: "Upcoming" },
            open: { bg: "bg-green-50", text: "text-green-700", label: "Registration Open" },
            live: { bg: "bg-orange-50", text: "text-orange-700", label: "Live" },
            completed: { bg: "bg-slate-100", text: "text-slate-600", label: "Completed" },
            closed: { bg: "bg-slate-100", text: "text-slate-500", label: "Closed" },
        };

        const config = statusConfig[status] || statusConfig.upcoming;
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">My Competitions</h3>
                    <p className="text-sm text-slate-500">History and upcoming events.</p>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    Total: {enrolledCompetitions?.length || 0}
                </span>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
                    <p className="text-slate-500">Loading your competitions...</p>
                </div>
            ) : enrolledCompetitions && enrolledCompetitions.length > 0 ? (
                <div className="space-y-4">
                    {enrolledCompetitions.map((comp) => (
                        <div
                            key={comp.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                                    <Trophy className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">{comp.title}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {comp.examDate ? formatDate(comp.examDate) : "TBD"}
                                        </span>
                                        {getStatusBadge(comp.status)}
                                    </div>
                                </div>
                            </div>
                            {comp.slug && (
                                <Link
                                    href={`/competitions/${comp.slug}`}
                                    className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
                                >
                                    View <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Trophy className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No competitions yet</h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
                        Enroll in an upcoming championship to see it listed here.
                    </p>
                    <Link
                        href="/competitions"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Browse Competitions
                    </Link>
                </div>
            )}
        </div>
    );
};
