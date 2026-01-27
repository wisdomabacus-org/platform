
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

export interface LeaderboardRow { // For specific competition results view
  id?: string;
  rank: number;
  studentName: string;
  grade: number;
  score: number;
}

export interface Submission {
  id: string; // submission id
  userId: string;
  userName: string;
  examType: string; // 'competition' or 'mock_test'
  examId: string; // competition_id or mock_test_id
  examTitle: string;

  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds

  status: string; // 'submitted', 'pending', etc.
  submittedAt: Date;
  startedAt: Date;
}

export interface SubmissionFilters {
  examType?: string;
  search?: string; // Search user or exam title
  status?: string;
  dateRange?: { from: Date; to: Date };
}
