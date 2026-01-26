import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Timer, Medal, ShieldCheck } from "lucide-react";

interface ResultProps {
  rank: number;
  score: number;
  totalQuestions: number;
  timeTaken: string; // e.g., "04:23"
  accuracy: number; // percentage
}

export function YourRankCard({ result }: { result: ResultProps }) {
  // Determine color theme based on rank
  const isTop3 = result.rank <= 3;
  const rankColor =
    result.rank === 1 ? "text-yellow-600 bg-yellow-50 border-yellow-200" :
      result.rank === 2 ? "text-slate-600 bg-slate-50 border-slate-200" :
        result.rank === 3 ? "text-amber-700 bg-amber-50 border-amber-200" :
          "text-primary bg-primary/5 border-primary/10";

  return (
    <Card className="border-0 shadow-md ring-1 ring-gray-200 overflow-hidden relative">
      {/* Background Gradient Decorative */}
      <div className={`absolute top-0 left-0 w-2 h-full ${result.rank === 1 ? 'bg-yellow-400' :
        result.rank === 2 ? 'bg-slate-400' :
          result.rank === 3 ? 'bg-amber-600' : 'bg-primary'
        }`} />

      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">

          {/* Left Block: The Big Rank */}
          <div className="flex-1 p-6 md:p-8 flex items-center gap-6">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-sm text-4xl font-bold ${rankColor}`}>
              {result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' : result.rank === 3 ? '🥉' : `#${result.rank}`}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                  Official Rank
                </Badge>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {isTop3 ? "Outstanding Performance!" : "Great Effort!"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                You are in the top <span className="font-semibold text-gray-900">10%</span> of participants.
              </p>
            </div>
          </div>

          {/* Right Block: The Stats Grid */}
          <div className="bg-gray-50/80 p-6 md:p-8 md:w-[45%] grid grid-cols-2 gap-y-6 gap-x-4 border-t md:border-t-0 md:border-l border-gray-100">

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Target className="w-4 h-4" /> Score
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {result.score} <span className="text-sm text-gray-400 font-normal">/ {result.totalQuestions * 10}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Timer className="w-4 h-4" /> Time Taken
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {result.timeTaken} <span className="text-sm text-gray-400 font-normal">mins</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <ShieldCheck className="w-4 h-4" /> Accuracy
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {result.accuracy}%
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                <Medal className="w-4 h-4" /> Status
              </div>
              <div className="text-base font-bold text-emerald-600 flex items-center gap-1">
                Qualified
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}