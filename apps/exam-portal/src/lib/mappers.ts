import type { Database } from '@platform/database';
/**
 * Type Mappers for Supabase Database Types
 * 
 * Converts snake_case database column names to camelCase frontend types.
 * This ensures UI components continue to work without modification.
 */

// ============================================================================
// Generic Utilities
// ============================================================================

/**
 * Convert snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Type helper: Convert snake_case keys to camelCase
 */
export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

/**
 * Type helper: Convert camelCase keys to snake_case
 */
export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
    ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
    : S;

/**
 * Transform object keys from snake_case to camelCase (type-safe)
 */
export type SnakeToCamelCaseObject<T> = {
    [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends Record<string, unknown>
    ? SnakeToCamelCaseObject<T[K]>
    : T[K] extends Array<infer U>
    ? U extends Record<string, unknown>
    ? Array<SnakeToCamelCaseObject<U>>
    : T[K]
    : T[K];
};

/**
 * Transform object keys from camelCase to snake_case (type-safe)
 */
export type CamelToSnakeCaseObject<T> = {
    [K in keyof T as CamelToSnakeCase<K & string>]: T[K] extends Record<string, unknown>
    ? CamelToSnakeCaseObject<T[K]>
    : T[K] extends Array<infer U>
    ? U extends Record<string, unknown>
    ? Array<CamelToSnakeCaseObject<U>>
    : T[K]
    : T[K];
};

// ============================================================================
// Runtime Transformation Functions
// ============================================================================

/**
 * Transform object keys from snake_case to camelCase
 * Handles nested objects and arrays
 */
export function mapSnakeToCamel<T extends Record<string, unknown>>(
    obj: T
): SnakeToCamelCaseObject<T> {
    if (obj === null || obj === undefined) {
        return obj as unknown as SnakeToCamelCaseObject<T>;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === 'object' && item !== null
                ? mapSnakeToCamel(item as Record<string, unknown>)
                : item
        ) as unknown as SnakeToCamelCaseObject<T>;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const camelKey = snakeToCamel(key);

        if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
                result[camelKey] = value.map((item) =>
                    typeof item === 'object' && item !== null
                        ? mapSnakeToCamel(item as Record<string, unknown>)
                        : item
                );
            } else {
                result[camelKey] = mapSnakeToCamel(value as Record<string, unknown>);
            }
        } else {
            result[camelKey] = value;
        }
    }

    return result as SnakeToCamelCaseObject<T>;
}

/**
 * Transform object keys from camelCase to snake_case
 * Handles nested objects and arrays
 */
export function mapCamelToSnake<T extends Record<string, unknown>>(
    obj: T
): CamelToSnakeCaseObject<T> {
    if (obj === null || obj === undefined) {
        return obj as unknown as CamelToSnakeCaseObject<T>;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) =>
            typeof item === 'object' && item !== null
                ? mapCamelToSnake(item as Record<string, unknown>)
                : item
        ) as unknown as CamelToSnakeCaseObject<T>;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = camelToSnake(key);

        if (value !== null && typeof value === 'object') {
            if (Array.isArray(value)) {
                result[snakeKey] = value.map((item) =>
                    typeof item === 'object' && item !== null
                        ? mapCamelToSnake(item as Record<string, unknown>)
                        : item
                );
            } else {
                result[snakeKey] = mapCamelToSnake(value as Record<string, unknown>);
            }
        } else {
            result[snakeKey] = value;
        }
    }

    return result as CamelToSnakeCaseObject<T>;
}

/**
 * Transform an array of objects from snake_case to camelCase
 */
export function mapArraySnakeToCamel<T extends Record<string, unknown>>(
    arr: T[]
): SnakeToCamelCaseObject<T>[] {
    return arr.map((item) => mapSnakeToCamel(item));
}

/**
 * Transform an array of objects from camelCase to snake_case
 */
export function mapArrayCamelToSnake<T extends Record<string, unknown>>(
    arr: T[]
): CamelToSnakeCaseObject<T>[] {
    return arr.map((item) => mapCamelToSnake(item));
}
// ============================================================================
// Entity Mappers
// ============================================================================

import type {
    InitializeExamResponse,
    Question,
    ExamOption,
    SubmitAnswerResponse,
    HeartbeatResponse,
    SubmitExamResponse,
    SubmissionResult
} from '../types/exam.types';

export interface DbInitExamResponse {
    session_token: string;
    submission_id: string;
    exam_type: string;
    exam_id: string;
    exam_title: string;
    duration_minutes: number;
    total_questions: number;
    time_remaining: number;
    start_time: number;
    end_time: number;
    questions: {
        id: string;
        question_text: string;
        image_url?: string;
        marks: number;
        options: { index: number; text: string }[];
    }[];
    saved_answers: Record<string, number>;
}

export function mapInitExamResponse(response: DbInitExamResponse): InitializeExamResponse {
    return {
        examSessionId: response.session_token,
        submissionId: response.submission_id,
        examType: response.exam_type as 'competition' | 'mock-test',
        examId: response.exam_id,
        examTitle: response.exam_title,
        durationMinutes: response.duration_minutes,
        totalQuestions: response.total_questions,
        timeRemaining: response.time_remaining,
        startTime: response.start_time,
        endTime: response.end_time,
        questions: response.questions.map(mapDbQuestionToQuestion),
        savedAnswers: response.saved_answers,
    };
}

export function mapDbQuestionToQuestion(q: {
    id: string;
    question_text: string;
    image_url?: string;
    marks: number;
    options: { index: number; text: string }[];
}): Question {
    return {
        id: q.id,
        questionText: q.question_text,
        text: q.question_text, // Alias
        imageUrl: q.image_url || null,
        marks: q.marks,
        options: q.options.map(o => ({
            id: `${q.id}_${o.index}`, // Virtual ID since backend doesn't return option IDs
            index: o.index,
            text: o.text
        })),
    };
}

export interface DbSubmitAnswerResponse {
    question_id: string;
    selected_option_index: number;
    saved_at: number;
}

export function mapSubmitAnswerResponse(response: DbSubmitAnswerResponse): Omit<SubmitAnswerResponse, 'success'> {
    return {
        questionId: response.question_id,
        selectedOptionIndex: response.selected_option_index,
        savedAt: response.saved_at,
    };
}

export interface DbHeartbeatResponse {
    is_active: boolean;
    time_remaining: number;
    answered_count: number;
    should_auto_submit: boolean;
    status: "in-progress" | "submitted" | "expired";
}

export function mapHeartbeatResponse(response: DbHeartbeatResponse): HeartbeatResponse {
    return {
        isActive: response.is_active,
        timeRemaining: response.time_remaining,
        answeredCount: response.answered_count,
        shouldAutoSubmit: response.should_auto_submit,
        status: response.status
    };
}

export interface DbSubmitExamResponse {
    submission_id: string;
    exam_type: string;
    redirect_url?: string;
}

export function mapSubmitExamResponse(response: DbSubmitExamResponse): Omit<SubmitExamResponse, 'success'> {
    return {
        submissionId: response.submission_id,
        examType: response.exam_type as 'competition' | 'mock-test',
        redirectUrl: response.redirect_url,
    };
}

export type DbSubmissionHistoryRow = Database['public']['Views']['user_submission_history']['Row'];

export function mapSubmissionResult(db: DbSubmissionHistoryRow): SubmissionResult {
    // Logic to determine examId (fallback to empty string if null)
    const examId = db.competition_id || db.mock_test_id || '';

    // Logic for totalMarks: try to extract from snapshot, else 0
    let totalMarks = 0;
    if (db.exam_snapshot && typeof db.exam_snapshot === 'object' && 'totalMarks' in db.exam_snapshot) {
        totalMarks = (db.exam_snapshot as { totalMarks?: number }).totalMarks || 0;
    }

    return {
        id: db.submission_id || '',
        userId: db.user_id || '',
        examType: (db.exam_type as "competition" | "mock-test") || 'competition',
        examId: examId,
        examTitle: db.exam_title || '',
        status: (db.status as "in-progress" | "completed" | "abandoned") || 'completed',
        score: db.score || 0,
        totalMarks: totalMarks,
        correctCount: db.correct_answers || 0,
        incorrectCount: db.incorrect_answers || 0,
        unansweredCount: db.unanswered || 0,
        percentage: db.percentage_score || 0,
        rank: db.rank || undefined,
        submittedAt: db.submitted_at || new Date().toISOString(),
        createdAt: db.started_at || new Date().toISOString(),
    };
}

