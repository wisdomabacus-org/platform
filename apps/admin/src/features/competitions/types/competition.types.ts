export interface QuestionOption {
  _id: string;
  text: string;
}

export interface Question {
  _id: string;
  questionText: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export type CompetitionType = 'ACTUAL' | 'MOCK';

export interface Competition {
  id: string;
  title: string;
  applicableGrades: number[];
  description: string;
  prizeDetails?: string;
  enrollmentFee: number;
  type: CompetitionType;
  isPublished: boolean;
  isResultsPublished: boolean;
  registrationStartDate: Date;
  registrationEndDate: Date;
  competitionDate: Date;
  examStartTime: string; // "HH:MM"
  examEndTime: string; // "HH:MM"
  resultsAnnouncementDate: Date;
  durationMinutes: number;
  questions: Question[];
  createdBy: string; // Admin ID
  createdAt: Date;
  updatedAt: Date;
}
