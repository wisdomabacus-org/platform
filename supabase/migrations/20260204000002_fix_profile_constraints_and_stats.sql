-- ============================================
-- Migration: Fix Profile Constraints and Admin Stats
-- Description: 
-- 1. Allow student_grade to be 0 (UKG) in all related tables
-- 2. Update admin dashboard stats to exclude admin users from user counts
-- Created: 2026-02-04
-- ============================================

-- ============================================
-- 1. FIX GRADE CONSTRAINTS (Allow 0 for UKG)
-- ============================================

-- Profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_student_grade_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_student_grade_check CHECK (student_grade BETWEEN 0 AND 12);

-- Competitions
ALTER TABLE public.competitions DROP CONSTRAINT IF EXISTS competitions_min_grade_check;
ALTER TABLE public.competitions ADD CONSTRAINT competitions_min_grade_check CHECK (min_grade BETWEEN 0 AND 12);

ALTER TABLE public.competitions DROP CONSTRAINT IF EXISTS competitions_max_grade_check;
ALTER TABLE public.competitions ADD CONSTRAINT competitions_max_grade_check CHECK (max_grade BETWEEN 0 AND 12);

-- Mock Tests
ALTER TABLE public.mock_tests DROP CONSTRAINT IF EXISTS mock_tests_min_grade_check;
ALTER TABLE public.mock_tests ADD CONSTRAINT mock_tests_min_grade_check CHECK (min_grade BETWEEN 0 AND 12);

ALTER TABLE public.mock_tests DROP CONSTRAINT IF EXISTS mock_tests_max_grade_check;
ALTER TABLE public.mock_tests ADD CONSTRAINT mock_tests_max_grade_check CHECK (max_grade BETWEEN 0 AND 12);

-- Question Banks
ALTER TABLE public.question_banks DROP CONSTRAINT IF EXISTS question_banks_min_grade_check;
ALTER TABLE public.question_banks ADD CONSTRAINT question_banks_min_grade_check CHECK (min_grade BETWEEN 0 AND 12);

ALTER TABLE public.question_banks DROP CONSTRAINT IF EXISTS question_banks_max_grade_check;
ALTER TABLE public.question_banks ADD CONSTRAINT question_banks_max_grade_check CHECK (max_grade BETWEEN 0 AND 12);

-- ============================================
-- 2. UPDATE ADMIN DASHBOARD STATS VIEW
-- ============================================

CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  -- Total users (excluding admins)
  (
    SELECT COUNT(*) 
    FROM public.profiles p 
    WHERE NOT EXISTS (
      SELECT 1 FROM public.admin_users a WHERE a.id = p.id
    )
  ) AS total_users,
  
  -- New users 30d (excluding admins)
  (
    SELECT COUNT(*) 
    FROM public.profiles p
    WHERE p.created_at > NOW() - INTERVAL '30 days'
    AND NOT EXISTS (
      SELECT 1 FROM public.admin_users a WHERE a.id = p.id
    )
  ) AS new_users_30d,
  
  -- Other stats remain the same
  (SELECT COUNT(*) FROM public.enrollments WHERE status = 'confirmed') AS total_enrollments,
  (SELECT COUNT(*) FROM public.payments WHERE status = 'SUCCESS') AS successful_payments,
  (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'SUCCESS') AS total_revenue_paise,
  (SELECT COUNT(*) FROM public.submissions WHERE status = 'completed') AS total_submissions,
  (SELECT COUNT(*) FROM public.competitions WHERE is_published = TRUE) AS active_competitions,
  (SELECT COUNT(*) FROM public.mock_tests WHERE is_published = TRUE) AS active_mock_tests;

-- Grant access to the view
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Profile constraints and Admin Stats migration completed successfully';
END $$;
