
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultDetailHeader } from '../components/detail-header';
import { ResultDetailToolbar } from '../components/detail-toolbar';
import { LeaderboardTable } from '../components/leaderboard-table';
import { useCompetition } from '@/features/competitions/hooks/use-competitions';
import { useLeaderboard } from '../hooks/use-results';
import { Loader2 } from 'lucide-react';

export default function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  // Ensure we have ID, though router usually guarantees it for this path
  const competitionId = id!;

  const { data: competition, isLoading: isLoadingComp } = useCompetition(competitionId);
  const { data: leaderboard, isLoading: isLoadingBoard } = useLeaderboard(competitionId);


  // UI state
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score'>('rank');

  const isLoading = isLoadingComp || isLoadingBoard;

  const rows = useMemo(() => {
    if (!leaderboard) return [];
    let r = leaderboard;

    if (grade !== 'all') {
      r = r.filter((x: any) => x.grade === grade);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter((x: any) => x.studentName.toLowerCase().includes(q));
    }
    if (sortBy === 'rank') {
      r = [...r].sort((a: any, b: any) => a.rank - b.rank);
    } else {
      r = [...r].sort((a: any, b: any) => b.score - a.score || a.rank - b.rank);
    }
    return r;
  }, [leaderboard, grade, search, sortBy]);

  const distinctGrades = useMemo(() => {
    if (!leaderboard) return [];
    const g = new Set(leaderboard.map((r: any) => r.grade));
    return Array.from(g).sort((a, b) => a - b);
  }, [leaderboard]);

  const onExport = () => {
    // Later: create CSV and download
    console.log('Export CSV', { id, grade, sortBy, search, count: rows.length });
  };



  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!competition) return <div>Competition not found</div>;

  const status = (competition.status === 'completed' || competition.status === 'published') ? 'published' : 'pending';

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-scroll py-10">
      <ResultDetailHeader
        title={competition.title}
        grades={distinctGrades}
        status={status}
        publishedAt={status === 'published' ? new Date() : undefined}
        total={competition.enrolled_count || 0}
      />

      <div className="px-6 py-6">
        <ResultDetailToolbar
          grades={distinctGrades}
          search={search}
          setSearch={setSearch}
          grade={grade}
          setGrade={setGrade}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onExport={onExport}
        />

        <LeaderboardTable rows={rows} />
      </div>
    </div>
  );
}
