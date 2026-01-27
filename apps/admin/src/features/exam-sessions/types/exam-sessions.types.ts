
export interface ExamSession {
    id: string; // session id
    userId: string;
    userName: string;

    examId: string;
    examType: string; // 'competition' or 'mock_test'
    // For joining title, we might need separate fields or a unified 'examTitle' from backend query
    examTitle: string;

    startTime: Date;
    endTime: Date;

    status: string; // 'started', 'completed', 'abandoned'
    isLocked: boolean;

    // Potentially calculated fields for monitoring
    timeLeft?: number; // minutes
}

export interface ExamSessionFilters {
    status?: string; // 'active' (default), 'completed'
}
