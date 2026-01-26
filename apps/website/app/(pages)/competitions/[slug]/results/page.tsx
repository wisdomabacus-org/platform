"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy, Medal, Zap, Target, ArrowLeft, Share2,
  CheckCircle2, Clock, Search, Gift, ChevronDown, Users, Calendar,
  Crown, Star, Sparkles
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
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// 1. MOCK DATA
// ----------------------------------------------------------------------

const generateLeaderboard = () => {
  const base = [
    { rank: 4, name: "Farooque Mehta (You)", score: 98, time: "8m 45s", school: "Oakridge International", city: "Hyderabad" },
    { rank: 5, name: "Ishaan Kumar", score: 97, time: "8m 10s", school: "KV No. 1", city: "Chennai" },
    { rank: 6, name: "Ananya Singh", score: 96, time: "9m 00s", school: "Lotus Valley", city: "Noida" },
    { rank: 7, name: "Rohan Das", score: 95, time: "8m 55s", school: "St. Xaviers", city: "Kolkata" },
    { rank: 8, name: "Mira Nair", score: 94, time: "9m 15s", school: "DPS South", city: "Bangalore" },
  ];
  for (let i = 9; i <= 60; i++) {
    base.push({
      rank: i,
      name: `Student ${i}`,
      score: Math.max(60, 94 - Math.floor((i - 8) / 2)),
      time: `${9 + Math.floor(i / 10)}m ${10 + (i % 10) * 5}s`,
      school: "Wisdom Academy",
      city: "India"
    });
  }
  return base;
};

const RESULT_DATA = {
  id: "comp_123",
  title: "National Abacus Championship 2025",
  date: "2025-12-20",
  totalParticipants: 2450,
  isPublished: true,
  // Enhanced Prize Data for Visuals
  prizes: {
    1: { title: "Cash Prize", value: "Worth ₹10,000", extra: "Gold Medal + Big Trophy" },
    2: { title: "Cash Prize", value: "Worth ₹5,000", extra: "Silver Medal" },
    3: { title: "Cash Prize", value: "Worth ₹2,500", extra: "Bronze Medal" }
  },
  currentUser: {
    rank: 4,
    score: 98,
    maxScore: 100,
    timeTaken: "8m 45s",
    accuracy: 98,
    speed: "1.2s",
    percentile: 99.2,
    status: "Qualified for Regionals"
  },
  topRankers: [
    { rank: 1, name: "Aarav Sharma", score: 100, time: "7m 12s", school: "Delhi Public School", city: "Delhi", avatar: "AS" },
    { rank: 2, name: "Vihaan Gupta", score: 100, time: "7m 30s", school: "Ryan International", city: "Mumbai", avatar: "VG" },
    { rank: 3, name: "Diya Patel", score: 99, time: "6m 50s", school: "Greenwood High", city: "Bangalore", avatar: "DP" },
  ],
  leaderboard: generateLeaderboard()
};

// ----------------------------------------------------------------------
// 2. COMPONENT: ULTIMATE PODIUM CARD
// ----------------------------------------------------------------------

const PodiumCard = ({ ranker, place, rewardData }: { ranker: any, place: 1 | 2 | 3, rewardData: any }) => {
  const styles = {
    1: {
      container: "z-10 order-1 md:order-2 scale-105 md:-mt-12",
      card: "bg-gradient-to-b from-orange-50 to-white border-orange-200 shadow-2xl shadow-orange-500/10 ring-1 ring-orange-100",
      badge: "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-600/30 border border-orange-400",
      badgeText: "CHAMPION",
      icon: <Trophy className="h-3.5 w-3.5 fill-current" />,
      avatar: "bg-gradient-to-br from-orange-400 to-red-500 ring-4 ring-white shadow-xl",
      prizeValue: "text-orange-700"
    },
    2: {
      container: "order-2 md:order-1 mt-4 md:mt-0",
      card: "bg-white border-slate-200 shadow-lg",
      badge: "bg-slate-100 text-slate-600 border border-slate-200",
      badgeText: "RUNNER UP",
      icon: <Medal className="h-3.5 w-3.5" />,
      avatar: "bg-gradient-to-br from-slate-400 to-slate-600 ring-4 ring-white shadow-lg",
      prizeValue: "text-slate-600"
    },
    3: {
      container: "order-3 md:order-3 mt-4 md:mt-0",
      card: "bg-white border-slate-200 shadow-lg",
      badge: "bg-slate-100 text-slate-600 border border-slate-200",
      badgeText: "2ND RUNNER UP",
      icon: <Medal className="h-3.5 w-3.5" />,
      avatar: "bg-gradient-to-br from-amber-400 to-amber-600 ring-4 ring-white shadow-lg",
      prizeValue: "text-slate-600"
    }
  };

  const style = styles[place];

  return (
    <div className={cn("relative flex flex-col w-full transition-all duration-500 hover:-translate-y-2", style.container)}>
      <div className={cn("relative flex flex-col items-center p-6 rounded-[2rem] border h-full", style.card)}>

        {/* Floating Badge - Overlapping Top Border */}
        <div className={cn("absolute -top-4 px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-2", style.badge)}>
          {style.icon}
          {style.badgeText}
        </div>

        {/* Avatar */}
        <div className="mt-6 mb-4 relative">
          <div className={cn("w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white", style.avatar)}>
            {ranker.avatar}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-white text-[#121212] border border-slate-100 shadow-sm">
            #{place}
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center w-full mb-6">
          <h3 className="text-lg font-bold text-[#121212] truncate">{ranker.name}</h3>
          <p className="text-xs text-slate-500 font-medium truncate">{ranker.school}</p>
        </div>

        {/* Prize Section */}
        <div className="w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 text-center mb-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs font-bold text-[#121212]">{rewardData.title}</p>
            <p className={cn("text-sm font-bold", style.prizeValue)}>{rewardData.value}</p>
          </div>
          {place === 1 && (
            <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-center gap-1.5 text-[10px] font-bold text-yellow-600 uppercase tracking-tight">
              <Medal className="h-3 w-3" />
              {rewardData.extra}
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
            <p className="text-base font-medium text-slate-600 font-mono">{ranker.time}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. MAIN PAGE COMPONENT
// ----------------------------------------------------------------------

export default function CompetitionResultsPage({ params }: { params: { id: string } }) {
  const id = "comp_123";
  const data = RESULT_DATA;

  // --- LOCAL STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  // Filter logic
  const filteredLeaderboard = useMemo(() => {
    return data.leaderboard.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const visibleData = filteredLeaderboard.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-slate-50 pb-24 selection:bg-orange-500 selection:text-white">

      {/* 1. HEADER SECTION */}
      <header className="bg-[#121212] pt-28 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          {/* Top Nav */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <Link href={`/competitions/${id}`} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Back to Competition
            </Link>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-white/10 bg-transparent text-slate-300 hover:text-white hover:bg-white/5 h-9 rounded-lg">
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
              <span className="text-slate-500 text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {new Date(data.date).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight mb-2">
              {data.title}
            </h1>
            <p className="text-slate-400">
              <span className="text-white font-bold">{data.totalParticipants}</span> students competed in this national event.
            </p>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <div className="container max-w-6xl mx-auto px-4 -mt-32 relative z-20 space-y-16">

        {/* A. USER SCORECARD */}
        <div className="bg-white rounded-3xl p-1 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-white rounded-[20px] border border-slate-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-50 rounded-bl-full -mr-8 -mt-8 opacity-50" />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-full bg-[#121212] flex flex-col items-center justify-center text-white shadow-2xl ring-8 ring-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rank</span>
                  <span className="text-4xl font-bold">{data.currentUser.rank}</span>
                </div>
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#121212] mb-1">Farooque, You were amazing!</h2>
                <p className="text-slate-500 text-sm mb-6">
                  You scored better than <span className="text-green-600 font-bold">{data.currentUser.percentile}%</span> of participants.
                </p>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Score</p>
                    <p className="text-xl font-bold text-[#121212]">{data.currentUser.score}</p>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-xs text-slate-400 uppercase font-bold">Time</p>
                    <p className="text-xl font-bold text-[#121212]">{data.currentUser.timeTaken}</p>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <p className="text-xs text-slate-400 uppercase font-bold">Accuracy</p>
                    <p className="text-xl font-bold text-green-600">{data.currentUser.accuracy}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* B. THE WINNERS PODIUM */}
        <div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" /> Hall of Fame
            </div>
            <h2 className="text-3xl font-bold text-[#121212]">Top Achievers</h2>
            <p className="text-slate-500 text-sm mt-2">Celebrating excellence and hard work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-10 gap-6 items-end max-w-4xl mx-auto px-2">
            <PodiumCard ranker={data.topRankers[1]} place={2} rewardData={data.prizes[2]} />
            <PodiumCard ranker={data.topRankers[0]} place={1} rewardData={data.prizes[1]} />
            <PodiumCard ranker={data.topRankers[2]} place={3} rewardData={data.prizes[3]} />
          </div>
        </div>

        {/* C. FULL LEADERBOARD TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24" id="leaderboard">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-[#121212] text-lg">Full Leaderboard</h3>
              <p className="text-xs text-slate-500 mt-1">Search to find any participant.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search student name..."
                className="pl-10 bg-white border-slate-200 h-10 rounded-xl focus-visible:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <TableHead className="text-right font-bold text-slate-400 uppercase text-[11px]">Score</TableHead>
                  <TableHead className="text-right font-bold text-slate-400 uppercase text-[11px]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.length > 0 ? (
                  visibleData.map((student) => {
                    const isMe = student.name.includes("(You)");
                    return (
                      <TableRow
                        key={student.rank}
                        className={cn(
                          "border-slate-50 transition-colors h-16",
                          isMe ? "bg-orange-50 hover:bg-orange-100" : "hover:bg-slate-50"
                        )}
                      >
                        <TableCell className="text-center">
                          <span className={cn(
                            "font-bold font-mono text-sm py-1 px-3 rounded-lg",
                            isMe ? "bg-orange-200 text-orange-800" : "bg-slate-100 text-slate-600",
                            student.rank <= 3 ? "text-[#121212] bg-yellow-100" : ""
                          )}>
                            #{student.rank}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-[#121212] text-sm md:text-base">{student.name}</div>
                          <div className="md:hidden text-xs text-slate-400 mt-0.5">{student.city}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-slate-600">
                          <span className="font-medium">{student.school}</span>, {student.city}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-bold text-[#121212] text-base">{student.score}</span>
                        </TableCell>
                        <TableCell className="text-right text-slate-500 font-mono text-xs">
                          {student.time}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Search className="h-8 w-8 mb-2 opacity-50" />
                        <p>No students found matching "{searchQuery}"</p>
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
                onClick={() => setVisibleCount(prev => prev + 20)}
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