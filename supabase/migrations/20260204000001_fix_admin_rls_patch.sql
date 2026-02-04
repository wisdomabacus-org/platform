-- ============================================
-- Migration: Fix Admin RLS Access (Patch)
-- Description: Ensures admin users have unrestricted access to all tables
--              by simplifying the admin check and adding missing policies
-- Created: 2026-02-04
-- ============================================

-- ============================================
-- STEP 1: RECREATE THE ADMIN CHECK FUNCTION
-- ============================================

-- Drop and recreate the function with better handling
DROP FUNCTION IF EXISTS public.is_admin_user() CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  is_admin BOOLEAN;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- If no user ID, return false
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user exists in admin_users table with active status
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id 
    AND status = 'active'
  ) INTO is_admin;
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO anon;

-- ============================================
-- STEP 2: DROP ALL EXISTING ADMIN POLICIES TO AVOID CONFLICTS
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Admins have full read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;

-- Admin Users
DROP POLICY IF EXISTS "Admins can read all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins have full access to admin_users" ON public.admin_users;

-- Competitions
DROP POLICY IF EXISTS "Admins have full read access to competitions" ON public.competitions;
DROP POLICY IF EXISTS "Admins can create competitions" ON public.competitions;
DROP POLICY IF EXISTS "Admins can update competitions" ON public.competitions;
DROP POLICY IF EXISTS "Admins can delete competitions" ON public.competitions;
DROP POLICY IF EXISTS "Admins have full access to competitions" ON public.competitions;

-- Competition Syllabus
DROP POLICY IF EXISTS "Admins have full access to competition_syllabus" ON public.competition_syllabus;

-- Competition Prizes
DROP POLICY IF EXISTS "Admins have full access to competition_prizes" ON public.competition_prizes;

-- Mock Tests
DROP POLICY IF EXISTS "Admins have full read access to mock_tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Admins can create mock_tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Admins can update mock_tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Admins can delete mock_tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Admins have full access to mock_tests" ON public.mock_tests;

-- Question Banks
DROP POLICY IF EXISTS "Admins have full access to question_banks" ON public.question_banks;

-- Questions
DROP POLICY IF EXISTS "Admins have full access to questions" ON public.questions;

-- Question Options
DROP POLICY IF EXISTS "Admins have full access to question_options" ON public.question_options;

-- Competition Question Banks
DROP POLICY IF EXISTS "Admins have full access to competition_question_banks" ON public.competition_question_banks;

-- Mock Test Question Banks
DROP POLICY IF EXISTS "Admins have full access to mock_test_question_banks" ON public.mock_test_question_banks;

-- Payments
DROP POLICY IF EXISTS "Admins have full read access to payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can create payments" ON public.payments;
DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;

-- Enrollments
DROP POLICY IF EXISTS "Admins have full read access to enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can create enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can update enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can delete enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins have full access to enrollments" ON public.enrollments;

-- Submissions
DROP POLICY IF EXISTS "Admins have full read access to submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admins have full access to submissions" ON public.submissions;

-- Submission Answers
DROP POLICY IF EXISTS "Admins have full read access to submission_answers" ON public.submission_answers;
DROP POLICY IF EXISTS "Admins have full access to submission_answers" ON public.submission_answers;

-- Referrer Profiles
DROP POLICY IF EXISTS "Admins have full access to referrer_profiles" ON public.referrer_profiles;

-- Contact Requests
DROP POLICY IF EXISTS "Admins have full read access to contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can update contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins can delete contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Admins have full access to contact_requests" ON public.contact_requests;

-- Demo Requests
DROP POLICY IF EXISTS "Admins have full read access to demo_requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins can update demo_requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins can delete demo_requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins have full access to demo_requests" ON public.demo_requests;

-- Exam Sessions
DROP POLICY IF EXISTS "Admins have full read access to exam_sessions" ON public.exam_sessions;
DROP POLICY IF EXISTS "Admins can update exam_sessions" ON public.exam_sessions;
DROP POLICY IF EXISTS "Admins have full access to exam_sessions" ON public.exam_sessions;

-- User Mock Test Attempts
DROP POLICY IF EXISTS "Admins have full read access to user_mock_test_attempts" ON public.user_mock_test_attempts;
DROP POLICY IF EXISTS "Admins have full access to user_mock_test_attempts" ON public.user_mock_test_attempts;

-- Referrers
DROP POLICY IF EXISTS "Admins have full access to referrers" ON public.referrers;

-- ============================================
-- STEP 3: CREATE UNIFIED ADMIN POLICIES (FOR ALL)
-- ============================================

-- Profiles - Admin Full Access
CREATE POLICY "admin_full_access_profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admin Users - Admin Full Access
CREATE POLICY "admin_full_access_admin_users"
  ON public.admin_users FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Competitions - Admin Full Access
CREATE POLICY "admin_full_access_competitions"
  ON public.competitions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Competition Syllabus - Admin Full Access
CREATE POLICY "admin_full_access_competition_syllabus"
  ON public.competition_syllabus FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Competition Prizes - Admin Full Access
CREATE POLICY "admin_full_access_competition_prizes"
  ON public.competition_prizes FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Mock Tests - Admin Full Access
CREATE POLICY "admin_full_access_mock_tests"
  ON public.mock_tests FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Question Banks - Admin Full Access
CREATE POLICY "admin_full_access_question_banks"
  ON public.question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Questions - Admin Full Access
CREATE POLICY "admin_full_access_questions"
  ON public.questions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Question Options - Admin Full Access
CREATE POLICY "admin_full_access_question_options"
  ON public.question_options FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Competition Question Banks - Admin Full Access
CREATE POLICY "admin_full_access_competition_question_banks"
  ON public.competition_question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Mock Test Question Banks - Admin Full Access
CREATE POLICY "admin_full_access_mock_test_question_banks"
  ON public.mock_test_question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Payments - Admin Full Access
CREATE POLICY "admin_full_access_payments"
  ON public.payments FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Enrollments - Admin Full Access
CREATE POLICY "admin_full_access_enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Submissions - Admin Full Access
CREATE POLICY "admin_full_access_submissions"
  ON public.submissions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Submission Answers - Admin Full Access
CREATE POLICY "admin_full_access_submission_answers"
  ON public.submission_answers FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Referrer Profiles - Admin Full Access
CREATE POLICY "admin_full_access_referrer_profiles"
  ON public.referrer_profiles FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Contact Requests - Admin Full Access
CREATE POLICY "admin_full_access_contact_requests"
  ON public.contact_requests FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Demo Requests - Admin Full Access
CREATE POLICY "admin_full_access_demo_requests"
  ON public.demo_requests FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Exam Sessions - Admin Full Access
CREATE POLICY "admin_full_access_exam_sessions"
  ON public.exam_sessions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- User Mock Test Attempts - Admin Full Access
CREATE POLICY "admin_full_access_user_mock_test_attempts"
  ON public.user_mock_test_attempts FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Referrers Table (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrers' AND table_schema = 'public') THEN
    EXECUTE 'CREATE POLICY "admin_full_access_referrers" ON public.referrers FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())';
  END IF;
END $$;

-- ============================================
-- STEP 4: ENSURE VIEWS ARE ACCESSIBLE
-- ============================================

-- Grant access to all views for authenticated users
DO $$
DECLARE
  view_name TEXT;
BEGIN
  FOR view_name IN 
    SELECT table_name FROM information_schema.views WHERE table_schema = 'public'
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO authenticated', view_name);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', view_name);
  END LOOP;
END $$;

-- ============================================
-- STEP 5: GRANT TABLE PERMISSIONS TO AUTHENTICATED ROLE
-- ============================================

-- Ensure authenticated users have base permissions (RLS will still apply)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competition_syllabus TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competition_prizes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_tests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_banks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.question_options TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competition_question_banks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mock_test_question_banks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_answers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrer_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.demo_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_mock_test_attempts TO authenticated;

-- Grant for referrers if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrers' AND table_schema = 'public') THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrers TO authenticated';
  END IF;
END $$;

-- ============================================
-- VERIFICATION: Log the migration completion
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Admin RLS Patch Migration completed successfully';
END $$;
