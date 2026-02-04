// src/types/exam.types.ts

// Mirrors backend examType union
export type ExamType = "competition" | "mock-test";

export interface ExamOption {
  id: string;          // from QuestionOption virtual id
  index: number;       // option index in the question
  text: string;        // option text
}

export interface Question {
  id: string;                 // question id (stringified ObjectId)
  questionText: string;       // matches backend questionBank.questions.questionText
  text: string;               // UI-friendly alias for now (same as questionText)
  imageUrl?: string | null;   // optional image
  options: ExamOption[];
  marks: number;              // marks per question
}

// Core exam metadata returned by initializeExam
export interface ExamMetadata {
  examSessionId: string;    // Redis exam session ID
  submissionId: string;     // MongoDB submission ID
  examType: ExamType;
  examId: string;           // competitionId or mockTestId
  examTitle: string;
  durationMinutes: number;  // canonical duration from backend
  totalQuestions: number;
  startTime: number;        // epoch ms from backend
  endTime: number;          // epoch ms from backend

  // TEMP: keep old field name so existing store code compiles
  // We'll gradually migrate usage from `duration` → `durationMinutes`.
  duration: number;
}

// Exact shape we expect from /exam/session/init (frontend-facing)
export interface InitializeExamResponse {
  examSessionId: string;
  submissionId: string;
  examTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  timeRemaining: number;
  startTime: number;
  endTime: number;
  examType: ExamType;
  examId: string;
  questions: Question[];
  savedAnswers?: Record<string, number>; // For session resume
}

// Payload to send when saving an answer
export interface SubmitAnswerPayload {
  questionId: string;
  selectedOptionIndex: number;
}

// Response from /exam/session/answer
export interface SubmitAnswerResponse {
  success: boolean;
  questionId: string;
  selectedOptionIndex: number;
  savedAt: number; // epoch ms
}

// Response from /exam/session/heartbeat
export interface HeartbeatResponse {
  isActive: boolean;
  timeRemaining: number;
  answeredCount: number;
  shouldAutoSubmit?: boolean;
  status?: "in-progress" | "submitted" | "expired";
}

// Response from /exam/session/submit
export interface SubmitExamResponse {
  success: boolean;
  submissionId: string;
  examType: ExamType;
  redirectUrl?: string;
  message?: string;
}

export interface SubmissionResult {
  id: string;
  userId: string;
  examType: "competition" | "mock-test";
  examId: string;
  examTitle: string;
  status: "in-progress" | "completed" | "abandoned";
  score: number;
  totalMarks: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  percentage: number;
  rank?: number;
  submittedAt: string;
  createdAt: string;
}
