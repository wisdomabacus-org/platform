export type ResultsStatus = 'pending' | 'published';

export interface CompetitionResultsRow {
  id: string;                 // unique row id
  competitionId: string;
  competitionTitle: string;
  grades: number[];           // grades with results tracked
  status: ResultsStatus;      // pending / published
  publishedAt?: Date;         // exists if published
  totalParticipants: number;  // count for context
}

export interface LeaderboardRow {
  id?: string;
  rank: number;
  studentName: string;
  grade: number;
  score: number;
}
