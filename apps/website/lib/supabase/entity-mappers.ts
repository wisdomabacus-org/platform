/**
 * Entity-Specific Type Mappers
 * 
 * Maps Supabase database types to frontend UI types.
 * Each entity has a mapper that transforms the DB row to the expected UI shape.
 */

import type { Database } from '@platform/database';
import { mapSnakeToCamel } from './mappers';
import type { MockTest as FrontendMockTest } from '@/types/mock-test';

// ============================================================================
// Database Type Aliases (from Supabase generated types)
// ============================================================================

type Tables = Database['public']['Tables'];
type Views = Database['public']['Views'];

// Row types from database
export type DbProfile = Tables['profiles']['Row'];
export type DbCompetition = Tables['competitions']['Row'];
export type DbCompetitionPrize = Tables['competition_prizes']['Row'];
export type DbCompetitionSyllabus = Tables['competition_syllabus']['Row'];
export type DbEnrollment = Tables['enrollments']['Row'];
export type DbPayment = Tables['payments']['Row'];
export type DbMockTest = Tables['mock_tests']['Row'];
export type DbContactRequest = Tables['contact_requests']['Row'];
export type DbDemoRequest = Tables['demo_requests']['Row'];
export type DbSubmission = Tables['submissions']['Row'];
export type DbExamSession = Tables['exam_sessions']['Row'];

// View types
export type DbCompetitionWithStatus = Views['competitions_with_status']['Row'];
export type DbMockTestWithStatus = Views['mock_tests_with_status']['Row'];

// Insert types
export type DbProfileInsert = Tables['profiles']['Insert'];
export type DbContactRequestInsert = Tables['contact_requests']['Insert'];
export type DbDemoRequestInsert = Tables['demo_requests']['Insert'];

// Update types
export type DbProfileUpdate = Tables['profiles']['Update'];

// ============================================================================
// Frontend Type Definitions (matching existing UI expectations)
// ============================================================================

export interface User {
    id: string;
    uid?: string;
    email?: string;
    phone?: string;
    authProvider: 'email' | 'phone' | 'google';
    parentName?: string;
    studentName?: string;
    studentGrade?: number;
    schoolName?: string;
    city?: string;
    state?: string;
    dateOfBirth?: string;
    isProfileComplete: boolean;
    emailVerified?: boolean;
    lastLogin?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SyllabusItem {
    topic: string;
    description?: string;
}

export interface PrizeDetails {
    rank: number;
    title: string;
    description?: string;
    cashPrize: number;
    worth?: number;
    type: 'trophy' | 'medal' | 'certificate' | 'cash';
}

export interface Competition {
    id: string;
    title: string;
    slug: string;
    season: string;
    description: string;
    status: 'open' | 'closed' | 'upcoming' | 'completed' | 'live';

    // Dates
    registrationStartDate: string;
    registrationEndDate: string;
    examDate: string;
    examWindowStart: string;
    examWindowEnd: string;
    resultsDate?: string;

    // Details
    duration: number;
    enrollmentFee: number;
    originalFee?: number;
    minGrade: number;
    maxGrade: number;

    // Content
    syllabus: SyllabusItem[];
    prizes: PrizeDetails[];

    // Stats & Config
    isTrainingAvailable: boolean;
    totalQuestions: number;
    totalMarks: number;
    enrolledCount: number;
    viewCount: number;
    seatsLimit: number;
    waitlistCount: number;

    // Flags
    isFeatured: boolean;
    isResultsPublished: boolean;
    isPublished: boolean;

    // Computed
    isRegistrationOpen?: boolean;

    createdAt: string;
    updatedAt: string;
}

// Re-export MockTest from the types folder so it's consistent
export type MockTest = FrontendMockTest;

export interface Enrollment {
    id: string;
    userId: string;
    competitionId: string;
    paymentId: string;
    status: string;
    isPaymentConfirmed: boolean;
    submissionId?: string;
    attributionCode?: string;
    competitionSnapshot: Record<string, unknown>;
    userSnapshot: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

export interface Payment {
    id: string;
    userId: string;
    referenceId: string;
    purpose: string;
    amount: number;
    baseAmount?: number;
    gstAmount?: number;
    currency: string;
    gateway?: string;
    status: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    failureReason?: string;
    gatewayResponse?: Record<string, unknown>;
    userSnapshot?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Entity Mappers
// ============================================================================

/**
 * Map database profile to frontend User type
 */
export function mapDbProfileToUser(profile: DbProfile): User {
    return {
        id: profile.id,
        uid: profile.uid,
        email: profile.email ?? undefined,
        phone: profile.phone ?? undefined,
        authProvider: profile.auth_provider as 'email' | 'phone' | 'google',
        parentName: profile.parent_name ?? undefined,
        studentName: profile.student_name ?? undefined,
        studentGrade: profile.student_grade ?? undefined,
        schoolName: profile.school_name ?? undefined,
        city: profile.city ?? undefined,
        state: profile.state ?? undefined,
        dateOfBirth: profile.date_of_birth ?? undefined,
        isProfileComplete: profile.is_profile_complete ?? false,
        emailVerified: profile.email_verified ?? undefined,
        lastLogin: profile.last_login ?? undefined,
        createdAt: profile.created_at ?? new Date().toISOString(),
        updatedAt: profile.updated_at ?? new Date().toISOString(),
    };
}

/**
 * Map database competition to frontend Competition type
 */
export function mapDbCompetitionToCompetition(
    competition: DbCompetition | DbCompetitionWithStatus,
    syllabus: DbCompetitionSyllabus[] = [],
    prizes: DbCompetitionPrize[] = []
): Competition {
    // Determine status - use computed status from view if available
    const status = 'is_registration_open' in competition
        ? (competition.status as Competition['status']) ?? 'upcoming'
        : (competition.status as Competition['status']) ?? 'upcoming';

    return {
        id: competition.id ?? '',
        title: competition.title ?? '',
        slug: competition.slug ?? '',
        season: competition.season ?? '',
        description: competition.description ?? '',
        status,

        registrationStartDate: competition.registration_start_date ?? '',
        registrationEndDate: competition.registration_end_date ?? '',
        examDate: competition.exam_date ?? '',
        examWindowStart: competition.exam_window_start ?? '',
        examWindowEnd: competition.exam_window_end ?? '',
        resultsDate: competition.results_date ?? undefined,

        duration: competition.duration ?? 0,
        enrollmentFee: competition.enrollment_fee ?? 0,
        originalFee: competition.original_fee ?? undefined,
        minGrade: competition.min_grade ?? 1,
        maxGrade: competition.max_grade ?? 12,

        syllabus: syllabus.map((s) => ({
            topic: s.topic,
            description: s.description ?? undefined,
        })),

        prizes: prizes.map((p) => ({
            rank: p.rank,
            title: p.title,
            description: p.description ?? undefined,
            cashPrize: p.cash_prize ?? 0,
            worth: p.worth ?? undefined,
            type: (p.prize_type as PrizeDetails['type']) ?? 'certificate',
        })),

        isTrainingAvailable: competition.is_training_available ?? false,
        totalQuestions: competition.total_questions ?? 0,
        totalMarks: competition.total_marks ?? 0,
        enrolledCount: competition.enrolled_count ?? 0,
        viewCount: competition.view_count ?? 0,
        seatsLimit: competition.seats_limit ?? 0,
        waitlistCount: competition.waitlist_count ?? 0,

        isFeatured: competition.is_featured ?? false,
        isResultsPublished: competition.is_results_published ?? false,
        isPublished: competition.is_published ?? false,

        // Add isRegistrationOpen from view if available
        isRegistrationOpen: 'is_registration_open' in competition
            ? (competition.is_registration_open ?? false)
            : undefined,

        createdAt: competition.created_at ?? new Date().toISOString(),
        updatedAt: competition.updated_at ?? new Date().toISOString(),
    };
}

/**
 * Map database mock test to frontend MockTest type
 */
export function mapDbMockTestToMockTest(mockTest: DbMockTest | DbMockTestWithStatus): MockTest {
    // Cast difficulty to proper union type
    const difficulty = (mockTest.difficulty ?? 'medium') as 'easy' | 'medium' | 'hard';

    return {
        id: mockTest.id ?? '',
        title: mockTest.title ?? '',
        description: mockTest.description ?? undefined,
        thumbnail: undefined, // Not in DB, will be added later if needed

        // Config
        totalQuestions: mockTest.total_questions ?? 0,
        totalMarks: (mockTest as { total_marks?: number }).total_marks ?? mockTest.total_questions ?? 0,
        duration: mockTest.duration ?? 30,

        // Grades
        minGrade: mockTest.min_grade ?? 1,
        maxGrade: mockTest.max_grade ?? 12,

        // Level/Category
        difficulty,

        // Metadata
        isPublished: mockTest.is_published ?? false,
        isFree: (mockTest as { is_free?: boolean }).is_free ?? true,

        createdAt: mockTest.created_at ?? new Date().toISOString(),
        updatedAt: mockTest.updated_at ?? new Date().toISOString(),
    };
}

/**
 * Map database enrollment to frontend Enrollment type
 */
export function mapDbEnrollmentToEnrollment(enrollment: DbEnrollment): Enrollment {
    return {
        id: enrollment.id,
        userId: enrollment.user_id,
        competitionId: enrollment.competition_id,
        paymentId: enrollment.payment_id,
        status: enrollment.status ?? 'pending',
        isPaymentConfirmed: enrollment.is_payment_confirmed ?? false,
        submissionId: enrollment.submission_id ?? undefined,
        attributionCode: enrollment.attribution_code ?? undefined,
        competitionSnapshot: enrollment.competition_snapshot as Record<string, unknown>,
        userSnapshot: enrollment.user_snapshot as Record<string, unknown>,
        createdAt: enrollment.created_at ?? new Date().toISOString(),
        updatedAt: enrollment.updated_at ?? new Date().toISOString(),
    };
}

/**
 * Map database payment to frontend Payment type
 */
export function mapDbPaymentToPayment(payment: DbPayment): Payment {
    return {
        id: payment.id,
        userId: payment.user_id,
        referenceId: payment.reference_id,
        purpose: payment.purpose,
        amount: payment.amount,
        baseAmount: payment.base_amount ?? undefined,
        gstAmount: payment.gst_amount ?? undefined,
        currency: payment.currency ?? 'INR',
        gateway: payment.gateway ?? undefined,
        status: payment.status ?? 'pending',
        razorpayOrderId: payment.razorpay_order_id ?? undefined,
        razorpayPaymentId: payment.razorpay_payment_id ?? undefined,
        razorpaySignature: payment.razorpay_signature ?? undefined,
        failureReason: payment.failure_reason ?? undefined,
        gatewayResponse: payment.gateway_response as Record<string, unknown> | undefined,
        userSnapshot: payment.user_snapshot as Record<string, unknown> | undefined,
        createdAt: payment.created_at ?? new Date().toISOString(),
        updatedAt: payment.updated_at ?? new Date().toISOString(),
    };
}

// ============================================================================
// Reverse Mappers (Frontend → Database for Insert/Update)
// ============================================================================

/**
 * Map frontend profile update to database format
 */
export function mapUserToDbProfileUpdate(data: {
    parentName?: string;
    studentName?: string;
    studentGrade?: number;
    schoolName?: string;
    city?: string;
    state?: string;
    phone?: string;
    dateOfBirth?: string;
}): DbProfileUpdate {
    return {
        parent_name: data.parentName,
        student_name: data.studentName,
        student_grade: data.studentGrade,
        school_name: data.schoolName,
        city: data.city,
        state: data.state,
        phone: data.phone,
        date_of_birth: data.dateOfBirth,
        updated_at: new Date().toISOString(),
    };
}

/**
 * Map frontend contact request to database format
 */
export function mapContactRequestToDb(data: {
    name: string;
    email: string;
    phone: string;
    subject?: string;
    message: string;
}): DbContactRequestInsert {
    return {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
    };
}

/**
 * Map frontend demo request to database format
 */
export function mapDemoRequestToDb(data: {
    parentName: string;
    studentName: string;
    email: string;
    phone: string;
    grade: number;
    slot: string;
    message?: string;
}): DbDemoRequestInsert {
    return {
        parent_name: data.parentName,
        student_name: data.studentName,
        email: data.email,
        phone: data.phone,
        grade: data.grade,
        slot: data.slot,
        message: data.message,
    };
}
