import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { LeaderboardRow } from '../types/results.types';

interface Props {
  rows: LeaderboardRow[];
}

export function LeaderboardTable({ rows }: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="w-[120px]">Grade</TableHead>
              <TableHead className="w-[120px] text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r.rank}>
                  <TableCell>{r.rank}</TableCell>
                  <TableCell className="font-medium">{r.studentName}</TableCell>
                  <TableCell>{r.grade}</TableCell>
                  <TableCell className="text-right">{r.score}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>
    </div>
  );
}
