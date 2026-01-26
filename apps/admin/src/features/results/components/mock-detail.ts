export interface LeaderboardRow {
  rank: number;
  studentName: string;
  grade: number;
  score: number; // out of 100
}

export interface ResultDetail {
  id: string;                 // result id
  competitionTitle: string;
  grades: number[];
  status: 'pending' | 'published';
  publishedAt?: Date;
  totalParticipants: number;
  leaderboard: LeaderboardRow[];
}

function randomName(i: number) {
  const first = ['Aarav', 'Vivaan', 'Aditya', 'Diya', 'Ishita', 'Riya', 'Arjun', 'Ananya', 'Kabir', 'Maya'];
  const last = ['Sharma', 'Patel', 'Iyer', 'Reddy', 'Nair', 'Das', 'Kapoor', 'Khan', 'Mehta', 'Joshi'];
  return `${first[i % first.length]} ${last[i % last.length]}`;
}

export const makeMockResultDetail = (id = 'r-1001'): ResultDetail => {
  const rows: LeaderboardRow[] = Array.from({ length: 50 }).map((_, i) => ({
    rank: i + 1,
    studentName: randomName(i),
    grade: ((i % 10) + 1),
    score: 100 - (i % 15) - Math.floor(i / 10),
  }));
  return {
    id,
    competitionTitle: 'Abacus Cup Finals',
    grades: [1, 2, 3, 4, 5],
    status: 'published',
    publishedAt: new Date(Date.now() - 86400000),
    totalParticipants: rows.length,
    leaderboard: rows,
  };
};
