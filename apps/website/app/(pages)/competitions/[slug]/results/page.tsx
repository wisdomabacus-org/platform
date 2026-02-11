"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Trophy, Medal, ArrowLeft, Share2,
  CheckCircle2, Search, ChevronDown,
  Sparkles, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
async function fetchCompetitionResults(slug: string): Promise<CompetitionResults> {
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

  // Get leaderboard from view
  const { data: leaderboard, error } = await supabase
    .from('competition_leaderboard')
    .select('*')
    .eq('competition_id', competition.id)
    .order('rank');

  if (error) {
    throw new Error(`Failed to fetch results: ${error.message}`);
  }

  return {
    competitionTitle: competition.title || 'Unknown Competition',
    competitionId: competition.id,
    results: (leaderboard || []).map((entry) => ({
      rank: entry.rank ?? 0,
      studentName: entry.student_name ?? 'Anonymous',
      studentGrade: entry.student_grade ?? undefined,
      schoolName: entry.school_name ?? undefined,
      city: entry.city ?? undefined,
      score: entry.score ?? 0,
      timeTaken: entry.time_taken ?? undefined,
      submittedAt: entry.submitted_at ?? undefined,
    })),
  };
}

// ----------------------------------------------------------------------
// Component: Podium Card for Top 3
// ----------------------------------------------------------------------
const PodiumCard = ({ ranker, place }: { ranker: LeaderboardEntry; place: 1 | 2 | 3 }) => {
  const styles = {
    1: {
      container: "z-10 order-1 md:order-2 scale-105 md:-mt-12",
      card: "bg-gradient-to-b from-orange-50 to-white border-orange-200 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-100",
      badge: "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/30 border border-orange-400",
      badgeText: "CHAMPION",
      icon: <Trophy className="h-3.5 w-3.5 fill-current" />,
      avatar: "bg-gradient-to-br from-orange-400 to-red-500 ring-4 ring-white shadow-xl",
    },
    2: {
      container: "order-2 md:order-1 mt-4 md:mt-0",
      card: "bg-white border-slate-200 shadow-lg",
      badge: "bg-slate-100 text-slate-600 border border-slate-200",
      badgeText: "RUNNER UP",
      icon: <Medal className="h-3.5 w-3.5" />,
      avatar: "bg-gradient-to-br from-slate-400 to-slate-600 ring-4 ring-white shadow-lg",
    },
    3: {
      container: "order-3 md:order-3 mt-4 md:mt-0",
      card: "bg-white border-slate-200 shadow-lg",
      badge: "bg-slate-100 text-slate-600 border border-slate-200",
      badgeText: "2ND RUNNER UP",
      icon: <Medal className="h-3.5 w-3.5" />,
      avatar: "bg-gradient-to-br from-amber-400 to-amber-600 ring-4 ring-white shadow-lg",
    }
  };

  const style = styles[place];
  const initials = ranker.studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={cn("relative flex flex-col w-full transition-all duration-500 hover:-translate-y-2", style.container)}>
      <div className={cn("relative flex flex-col items-center p-6 rounded-[2rem] border h-full", style.card)}>
        {/* Floating Badge */}
        <div className={cn("absolute -top-4 px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2", style.badge)}>
          {style.icon}
          {style.badgeText}
        </div>

        {/* Avatar */}
        <div className="mt-6 mb-4 relative">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white", style.avatar)}>
            {initials}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-white text-[#121212] border border-slate-100 shadow-sm">
            #{place}
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center w-full mb-6">
          <h3 className="text-lg font-bold text-[#121212] truncate">{ranker.studentName}</h3>
          <p className="text-xs text-slate-500 font-medium truncate">
            {ranker.schoolName || ranker.city || 'Wisdom Academy'}
          </p>
        </div>

        {/* Prize Section */}
        <div className="w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 text-center mb-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-bold text-[#121212]">
              {place === 1 ? "🥇 First Prize" : place === 2 ? "🥈 Second Prize" : "🥉 Third Prize"}
            </p>
          </div>
          {place === 1 && (
            <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-yellow-600 uppercase tracking-tight">
              <Trophy className="h-3 w-3" />
              Gold Medal + Trophy
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 w-full pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Score</p>
            <p className="text-base font-bold text-[#121212]">{ranker.score}</p>
          </div>
          <div className="text-center border-l border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Time</p>
            <p className="text-base font-medium text-slate-600 font-mono">{formatTime(ranker.timeTaken)}</p>
          </div>
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
    {/* Header Skeleton */}
    <header className="bg-[#121212] pt-28 pb-48 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex justify-between items-start mb-10">
          <Skeleton className="h-8 w-40 bg-white/10" />
          <Skeleton className="h-9 w-32 bg-white/10" />
        </div>
        <div className="max-w-3xl space-y-4">
          <Skeleton className="h-6 w-48 bg-white/10" />
          <Skeleton className="h-12 w-full bg-white/10" />
          <Skeleton className="h-5 w-64 bg-white/10" />
        </div>
      </div>
    </header>

    {/* Content Skeleton */}
    <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-20 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-80 rounded-[2rem]" />
        <Skeleton className="h-80 rounded-[2rem]" />
        <Skeleton className="h-80 rounded-[2rem]" />
      </div>
      <Skeleton className="h-96 w-full rounded-3xl" />
    </div>
  </main>
);

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------
export default function CompetitionResultsPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Fetch results using React Query
  const { data: results, isLoading, error } = useQuery({
    queryKey: ['competition-results', slug],
    queryFn: () => fetchCompetitionResults(slug),
    retry: 1,
  });

  // Filter logic
  const filteredLeaderboard = useMemo(() => {
    if (!results?.results) return [];
    return results.results.filter(student =>
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.schoolName && student.schoolName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, results]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleCount(20); // Reset visible count on search
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 20);
  }, []);

  const visibleData = filteredLeaderboard.slice(0, visibleCount);
  
  // Get top 3 for podium
  const top3 = results?.results?.slice(0, 3) || [];
  const totalParticipants = results?.results?.length || 0;

  if (isLoading) {
    return <ResultsPageSkeleton />;
  }

  if (error || !results || totalParticipants === 0) {
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
          <Card className="bg-white rounded-3xl shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#121212] mb-2">
                {error ? "Unable to Load Results" : "Results Not Available"}
              </h2>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                {error 
                  ? "There was an error loading the competition results. Please try again later."
                  : "The results for this competition haven't been published yet. Check back later!"}
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
                      title: `${results.competitionTitle} - Results`,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-2" /> Share Result
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-3 py-1">
                <CheckCircle2 className="h-3 w-3 mr-1.5" /> Results Declared
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-2">
              {results.competitionTitle}
            </h1>
            <p className="text-slate-400">
              <span className="text-white font-bold">{totalParticipants}</span> students competed in this national event.
            </p>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-20 space-y-16">

        {/* B. THE WINNERS PODIUM */}
        {top3.length > 0 && (
          <div>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3 w-3" /> Hall of Fame
              </div>
              <h2 className="text-3xl font-bold text-[#121212]">Top Achievers</h2>
              <p className="text-slate-500 text-sm mt-2">Celebrating excellence and hard work</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-10 gap-6 items-end max-w-4xl mx-auto px-2">
              {top3[1] && <PodiumCard ranker={top3[1]} place={2} />}
              {top3[0] && <PodiumCard ranker={top3[0]} place={1} />}
              {top3[2] && <PodiumCard ranker={top3[2]} place={3} />}
            </div>
          </div>
        )}

        {/* C. FULL LEADERBOARD TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24" id="leaderboard">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-[#121212] text-lg">Full Leaderboard</h3>
              <p className="text-xs text-slate-500 mt-1">
                {filteredLeaderboard.length} participants
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search student name..."
                className="pl-10 bg-white border-slate-200 h-10 rounded-xl focus-visible:ring-orange-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100 bg-slate-50/30">
                  <TableHead className="w-[80px] text-center font-bold text-slate-400 uppercase text-[11px]">Rank</TableHead>
                  <TableHead className="font-bold text-slate-400 uppercase text-[11px]">Student Name</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-slate-400 uppercase text-[11px]">School / City</TableHead>
                  <TableHead className="hidden sm:table-cell text-right font-bold text-slate-400 uppercase text-[11px]">Grade</TableHead>
                  <TableHead className="text-right font-bold text-slate-400 uppercase text-[11px]">Score</TableHead>
                  <TableHead className="hidden sm:table-cell text-right font-bold text-slate-400 uppercase text-[11px]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.length > 0 ? (
                  visibleData.map((student) => (
                    <TableRow
                      key={student.rank}
                      className={cn(
                        "border-slate-50 transition-colors h-16 hover:bg-slate-50",
                        student.rank <= 3 ? "bg-yellow-50/30" : ""
                      )}
                    >
                      <TableCell className="text-center">
                        <span className={cn(
                          "font-bold font-mono text-sm py-1 px-3 rounded-lg",
                          student.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                          student.rank === 2 ? "bg-slate-200 text-slate-700" :
                          student.rank === 3 ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-600"
                        )}>
                          #{student.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-[#121212] text-sm md:text-base">{student.studentName}</div>
                        <div className="md:hidden text-xs text-slate-400 mt-0.5">{student.city || 'India'}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-slate-600">
                        {student.schoolName ? (
                          <><span className="font-medium">{student.schoolName}</span>{student.city && <>, {student.city}</>}</>
                        ) : (
                          student.city || '-'
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right text-sm text-slate-600">
                        {student.studentGrade ? `Grade ${student.studentGrade}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-[#121212] text-base">{student.score}</span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right text-slate-500 font-mono text-xs">
                        {formatTime(student.timeTaken)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="h-8 w-8 mb-2 opacity-50" />
                        <p>No students found matching &quot;{searchQuery}&quot;</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {visibleCount < filteredLeaderboard.length && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
              <Button
                variant="ghost"
                onClick={handleLoadMore}
                className="text-slate-500 hover:text-[#121212] hover:bg-white border border-transparent hover:border-slate-200"
              >
                Load More Results <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
