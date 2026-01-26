import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Medal } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl?: string;
  score: number;
  timeTaken: string;
  accuracy: number;
  school?: string;
}

export function LeaderboardTable({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {

  // Helper for rank icons
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-lg shadow-sm border border-yellow-200" title="Gold">🥇</div>;
      case 2:
        return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg shadow-sm border border-slate-200" title="Silver">🥈</div>;
      case 3:
        return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-lg shadow-sm border border-amber-200" title="Bronze">🥉</div>;
      default:
        return <span className="text-gray-500 font-bold w-8 text-center">#{rank}</span>;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
            <TableHead className="w-[80px] font-semibold text-gray-600">Rank</TableHead>
            <TableHead className="font-semibold text-gray-600">Student</TableHead>
            <TableHead className="font-semibold text-gray-600 hidden md:table-cell">School</TableHead>
            <TableHead className="text-right font-semibold text-gray-600">Score</TableHead>
            <TableHead className="text-right font-semibold text-gray-600">Accuracy</TableHead>
            <TableHead className="text-right font-semibold text-gray-600 hidden sm:table-cell">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((student) => (
            <TableRow
              key={student.rank}
              className={`
                    transition-colors hover:bg-blue-50/30
                    ${student.rank <= 3 ? 'bg-white font-medium' : 'bg-white'}
                `}
            >
              {/* Rank Column */}
              <TableCell className="py-4">
                {getRankBadge(student.rank)}
              </TableCell>

              {/* Student Name & Avatar */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-gray-100">
                    <AvatarImage src={student.avatarUrl} alt={student.name} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {student.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                    <span className="text-xs text-gray-500 md:hidden block max-w-[120px] truncate">
                      {student.school || "Wisdom Academy"}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* School (Hidden on Mobile) */}
              <TableCell className="hidden md:table-cell text-gray-600 text-sm py-4">
                {student.school || "Wisdom Academy"}
              </TableCell>

              {/* Score */}
              <TableCell className="text-right py-4">
                <span className="font-bold text-gray-900">{student.score}</span>
              </TableCell>

              {/* Accuracy */}
              <TableCell className="text-right py-4">
                <Badge variant="secondary" className={`
                    bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal
                    ${student.accuracy >= 90 ? 'text-green-700 bg-green-50 ring-1 ring-green-600/20' : ''}
                `}>
                  {student.accuracy}%
                </Badge>
              </TableCell>

              {/* Time (Hidden on very small screens) */}
              <TableCell className="text-right hidden sm:table-cell text-gray-500 text-sm py-4 font-mono">
                {student.timeTaken}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}