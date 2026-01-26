import { useMemo } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select';
import { Download } from 'lucide-react';

interface Props {
  grades: number[];
  search: string;
  setSearch: (v: string) => void;
  grade: number | 'all';
  setGrade: (g: number | 'all') => void;
  sortBy: 'rank' | 'score';
  setSortBy: (s: 'rank' | 'score') => void;
  onExport?: () => void;
}

export function ResultDetailToolbar({
  grades,
  search,
  setSearch,
  grade,
  setGrade,
  sortBy,
  setSortBy,
  onExport,
}: Props) {
  const sortedGrades = useMemo(() => [...grades].sort((a, b) => a - b), [grades]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search student…"
            className="w-full md:max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={String(grade)}
            onValueChange={(v) => setGrade(v === 'all' ? 'all' : Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {sortedGrades.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  Grade {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'rank' | 'score')}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="score">Score</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
