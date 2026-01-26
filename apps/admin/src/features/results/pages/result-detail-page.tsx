import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResultDetailHeader } from '../components/detail-header';
import { ResultDetailToolbar } from '../components/detail-toolbar';
import { LeaderboardTable } from '../components/leaderboard-table';
import { makeMockResultDetail, ResultDetail } from '../components/mock-detail';

export default function ResultDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<ResultDetail | null>(null);

  // UI state
  const [search, setSearch] = useState('');
  const [grade, setGrade] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'score'>('rank');

  useEffect(() => {
    setData(makeMockResultDetail(id));
  }, [id]);

  const rows = useMemo(() => {
    if (!data) return [];
    let r = data.leaderboard;

    if (grade !== 'all') {
      r = r.filter((x) => x.grade === grade);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter((x) => x.studentName.toLowerCase().includes(q));
    }
    if (sortBy === 'rank') {
      r = [...r].sort((a, b) => a.rank - b.rank);
    } else {
      r = [...r].sort((a, b) => b.score - a.score || a.rank - b.rank);
    }
    return r;
  }, [data, grade, search, sortBy]);

  const onExport = () => {
    // Later: create CSV and download
    console.log('Export CSV', { id, grade, sortBy, search, count: rows.length });
  };

  if (!data) return null;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-y-scroll py-10">
      <ResultDetailHeader
        title={data.competitionTitle}
        grades={data.grades}
        status={data.status}
        publishedAt={data.publishedAt}
        total={data.totalParticipants}
      />

      <div className="px-6 py-6">
        <ResultDetailToolbar
          grades={data.grades}
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
