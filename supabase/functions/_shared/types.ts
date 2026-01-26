// supabase/functions/_shared/types.ts
// Shared types for Edge Functions

// ==========================================
// Exam Types
// ==========================================

export type ExamType = "competition" | "mock-test";

export interface ExamSession {
    id: string;
    session_token: string;
    user_id: string;
    exam_type: ExamType;
    exam_id: string;
    submission_id: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    answers: Record<string, ExamAnswer>;
    status: "in-progress" | "submitted" | "expired";
    is_locked: boolean;
    expires_at: string;
}

export interface ExamAnswer {
    selected_option_index: number;
    answered_at: number;
}

export interface Question {
    id: string;
    question_text: string;
    image_url?: string;
    options: QuestionOption[];
    marks: number;
    correct_option_index: number;
}

export interface QuestionOption {
    option_index: number;
    text: string;
}

export interface ExamQuestionForClient {
    id: string;
    question_text: string;
    image_url?: string;
    options: { index: number; text: string }[];
    marks: number;
}

// ==========================================
// Payment Types
// ==========================================

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentPurpose = "COMPETITION_ENROLLMENT";

export interface Payment {
    id: string;
    user_id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    gateway: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    purpose: PaymentPurpose;
    reference_id: string;
    gst_amount: number;
    base_amount: number;
    user_snapshot: Record<string, unknown>;
    failure_reason?: string;
    gateway_response?: Record<string, unknown>;
}

// ==========================================
// Enrollment Types
// ==========================================

export type EnrollmentStatus = "pending" | "confirmed" | "cancelled";

export interface Enrollment {
    id: string;
    user_id: string;
    competition_id: string;
    payment_id: string;
    submission_id?: string;
    is_payment_confirmed: boolean;
    status: EnrollmentStatus;
    competition_snapshot: {
        title: string;
        exam_date: string;
        enrollment_fee: number;
    };
    user_snapshot: {
        name: string;
        email: string;
        grade: number;
    };
    attribution_code?: string;
}

// ==========================================
// User Types
// ==========================================

export interface UserProfile {
    id: string;
    uid: string;
    email?: string;
    phone?: string;
    parent_name?: string;
    student_name?: string;
    student_grade?: number;
    school_name?: string;
    city?: string;
    state?: string;
    is_profile_complete: boolean;
    referred_by_code?: string;
}

// ==========================================
// Competition Types
// ==========================================

export interface Competition {
    id: string;
    title: string;
    slug: string;
    status: string;
    registration_start_date: string;
    registration_end_date: string;
    exam_date: string;
    exam_window_start: string;
    exam_window_end: string;
    duration: number;
    enrollment_fee: number;
    min_grade: number;
    max_grade: number;
    total_questions: number;
    total_marks: number;
    is_published: boolean;
}

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
