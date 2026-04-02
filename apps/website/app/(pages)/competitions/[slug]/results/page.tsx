"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy, Medal, ArrowLeft, Share2,
  CheckCircle2, AlertCircle, Award, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/hooks/use-auth";

// ----------------------------------------------------------------------
// Types from database view
// ----------------------------------------------------------------------
interface LeaderboardEntry {
  rank: number;
  studentName: string;
  studentGrade?: number;
  schoolName?: string;
  city?: string;
  score: number;
  timeTaken?: number; // in seconds
  submittedAt?: string;
}

interface CompetitionResults {
  competitionTitle: string;
  competitionId: string;
  results: LeaderboardEntry[];
}

// ----------------------------------------------------------------------
// Helper: Format time in seconds to readable string
// ----------------------------------------------------------------------
const formatTime = (seconds?: number): string => {
  if (!seconds) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
};

// ----------------------------------------------------------------------
// Fetch function using Supabase client
// ----------------------------------------------------------------------
async function fetchUserCompetitionResult(slug: string, userId: string): Promise<CompetitionResults> {
  const supabase = createClient();

  // First get competition by slug to get the ID
  const { data: competition, error: compError } = await supabase
    .from('competitions')
    .select('id, title')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (compError || !competition) {
    throw new Error('Competition not found');
  }

  // Get leaderboard from view FOR THIS USER ONLY
  const { data: leaderboard, error } = await supabase
    .from('competition_leaderboard')
    .select('*')
    .eq('competition_id', competition.id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  return {
    competitionTitle: competition.title || 'Unknown Competition',
    competitionId: competition.id,
    results: leaderboard ? [{
      rank: leaderboard.rank ?? 0,
      studentName: leaderboard.student_name ?? 'Anonymous',
      studentGrade: leaderboard.student_grade ?? undefined,
      schoolName: leaderboard.school_name ?? undefined,
      city: leaderboard.city ?? undefined,
      score: leaderboard.score ?? 0,
      timeTaken: leaderboard.time_taken ?? undefined,
      submittedAt: leaderboard.submitted_at ?? undefined,
    }] : [],
  };
}

// ----------------------------------------------------------------------
// Component: Single Result Card
// ----------------------------------------------------------------------
const UserResultCard = ({ result, competitionTitle }: { result: LeaderboardEntry; competitionTitle: string }) => {
  const rank = result.rank;

  // Decide styles based on rank
  let cardClass = "";
  let badgeClass = "";
  let badgeText = "";
  let icon = null;
  let avatarClass = "";
  let prizeText = "";

  if (rank === 1) {
    cardClass = "bg-gradient-to-b from-orange-50 to-white border-orange-200 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-100 scale-105";
    badgeClass = "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/30 border border-orange-400";
    badgeText = "CHAMPION";
    icon = <Trophy className="h-4 w-4 fill-current mr-2" />;
    avatarClass = "bg-gradient-to-br from-orange-400 to-red-500 ring-4 ring-white shadow-xl text-white";
    prizeText = "🥇 First Prize (Gold Medal + Trophy)";
  } else if (rank === 2) {
    cardClass = "bg-gradient-to-b from-slate-50 to-white border-slate-200 shadow-xl ring-1 ring-slate-100";
    badgeClass = "bg-slate-100 text-slate-700 border border-slate-300 shadow-md";
    badgeText = "RUNNER UP 1";
    icon = <Medal className="h-4 w-4 mr-2" />;
    avatarClass = "bg-gradient-to-br from-slate-400 to-slate-600 ring-4 ring-white shadow-lg text-white";
    prizeText = "🥈 Second Prize (Silver Medal)";
  } else if (rank === 3) {
    cardClass = "bg-gradient-to-b from-orange-50/50 to-white border-amber-200 shadow-xl ring-1 ring-amber-100";
    badgeClass = "bg-amber-100 text-amber-800 border border-amber-300 shadow-md";
    badgeText = "RUNNER UP 2";
    icon = <Medal className="h-4 w-4 mr-2" />;
    avatarClass = "bg-gradient-to-br from-amber-400 to-amber-600 ring-4 ring-white shadow-lg text-white";
    prizeText = "🥉 Third Prize (Bronze Medal)";
  } else {
    cardClass = "bg-white border-slate-200 shadow-lg";
    badgeClass = "bg-blue-50 text-blue-700 border border-blue-200";
    badgeText = "PARTICIPANT";
    icon = <Award className="h-4 w-4 mr-2" />;
    avatarClass = "bg-gradient-to-br from-blue-400 to-indigo-500 ring-4 ring-white shadow-md text-white";
    prizeText = "Certificate of Participation";
  }

  const initials = result.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn("relative flex flex-col w-full max-w-md mx-auto transition-all duration-500", cardClass, "rounded-[2rem] border p-8 mt-8")}>

      {/* Floating Badge */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <div className={cn("px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center", badgeClass)}>
          {icon}
          {badgeText}
        </div>
      </div>

      {/* Avatar */}
      <div className="mt-6 mb-6 relative mx-auto">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold", avatarClass)}>
          {initials}
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full flex items-center justify-center text-xs font-bold bg-[#121212] text-white shadow-md whitespace-nowrap">
          Rank #{rank}
        </div>
      </div>

      {/* Student Info */}
      <div className="text-center w-full mb-8">
        <h3 className="text-2xl font-bold text-[#121212] mb-1">{result.studentName}</h3>
        <p className="text-sm text-slate-500 font-medium">
          {result.schoolName || result.city || 'Wisdom Academy'}
          {result.studentGrade && ` • Grade ${result.studentGrade}`}
        </p>
      </div>

      {/* Prize Section */}
      <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-100 text-center mb-6">
        <p className="text-sm font-bold text-[#121212] flex items-center justify-center gap-2">
          <Star className="h-4 w-4 text-orange-500" />
          {prizeText}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-100">
        <div className="text-center bg-slate-50 py-3 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Score</p>
          <p className="text-2xl font-bold text-[#121212]">{result.score}</p>
        </div>
        <div className="text-center bg-slate-50 py-3 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">Time Took</p>
          <p className="text-xl font-medium text-slate-700 font-mono mt-1">{formatTime(result.timeTaken)}</p>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Loading Skeleton Component
// ----------------------------------------------------------------------
const ResultsPageSkeleton = () => (
  <main className="min-h-screen bg-slate-50 pb-24">
    <header className="bg-[#121212] pt-28 pb-48 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <Skeleton className="h-8 w-40 bg-white/10 mb-10" />
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <Skeleton className="h-12 w-full bg-white/10" />
        </div>
      </div>
    </header>
    <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-20 flex justify-center">
      <Skeleton className="h-[500px] w-full max-w-md rounded-[2rem]" />
    </div>
  </main>
);

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------
export default function CompetitionResultsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { user, isLoading: isAuthLoading } = useCurrentUser();

  // Fetch results using React Query
  const { data: results, isLoading: isResultsLoading, error } = useQuery({
    queryKey: ['competition-results', slug, user?.id],
    queryFn: () => fetchUserCompetitionResult(slug, user!.id),
    enabled: !!user?.id,
    retry: 1,
  });

  const isLoading = isAuthLoading || isResultsLoading;

  if (isLoading) {
    return <ResultsPageSkeleton />;
  }

  // Not logged in UI
  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 pb-24">
        <header className="bg-[#121212] pt-28 pb-32 relative overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <Link href={`/competitions/${slug}`} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Back to Competition
            </Link>
          </div>
        </header>
        <div className="container max-w-6xl mx-auto px-4 -mt-16 relative z-20">
          <Card className="bg-white rounded-3xl shadow-xl max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#121212] mb-2">Login Required</h2>
              <p className="text-slate-500 mb-6">
                Please log in to view your competition results and scorecard.
              </p>
              <Link href={`/competitions/${slug}`}>
                <Button className="bg-[#121212] hover:bg-slate-800 text-white">
                  Back
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Error or no results UI
  if (error || !results || results.results.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 pb-24">
        <header className="bg-[#121212] pt-28 pb-32 relative overflow-hidden">
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <Link href={`/competitions/${slug}`} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Back to Competition
            </Link>
          </div>
        </header>
        <div className="container max-w-6xl mx-auto px-4 -mt-16 relative z-20">
          <Card className="bg-white rounded-3xl shadow-xl max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#121212] mb-2">
                {error ? "Unable to Load Results" : "No Records Found"}
              </h2>
              <p className="text-slate-500 mb-6">
                {error
                  ? "There was an error loading your results. Please try again later."
                  : "We couldn't find your submission for this competition. Results might not be published yet."}
              </p>
              <Link href={`/competitions/${slug}`}>
                <Button className="bg-[#121212] hover:bg-slate-800 text-white">
                  Back to Competition
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const userResult = results.results[0];

  return (
    <main className="min-h-screen bg-slate-50 pb-24 selection:bg-orange-500 selection:text-white">
      {/* 1. HEADER SECTION */}
      <header className="bg-[#121212] pt-28 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          {/* Top Nav */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <Link href={`/competitions/${slug}`} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Back to Competition
            </Link>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-transparent text-slate-300 hover:text-white hover:bg-white/5 h-9 rounded-lg"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${results.competitionTitle} - My Scorecard`,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Scorecard
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="max-w-3xl text-center mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
                <CheckCircle2 className="h-3 w-3 mr-1.5" /> Official Scorecard
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
              {results.competitionTitle}
            </h1>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT (SINGLE SCORECARD) */}
      <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-20">
        <UserResultCard result={userResult} competitionTitle={results.competitionTitle} />
      </div>
    </main>
  );
}

