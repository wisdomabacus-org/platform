-- ============================================
-- Migration: Admin Full Access RLS Policies
-- Description: Allow authenticated admin users to have full access to all tables
--              needed for the admin panel functionality
-- Created: 2026-02-03
-- ============================================

-- ============================================
-- 1. CREATE HELPER FUNCTION TO CHECK IF USER IS ADMIN
-- ============================================

-- Function to check if the current authenticated user is an admin
-- Checks if the user exists in the admin_users table
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- ============================================
-- 2. PROFILES - Admin Full Access
-- ============================================

-- Admins can read all profiles
CREATE POLICY "Admins have full read access to profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin_user());

-- Admins can update any profile (for status changes, etc.)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete profiles (for user removal)
CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 3. ADMIN_USERS - Admin Full Access
-- ============================================

-- Admins can read all admin users
CREATE POLICY "Admins can read all admin users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin_user());

-- Admins can manage other admin users
CREATE POLICY "Admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 4. COMPETITIONS - Admin Full Access
-- ============================================

-- Admins can read all competitions (including drafts)
CREATE POLICY "Admins have full read access to competitions"
  ON public.competitions FOR SELECT
  USING (public.is_admin_user());

-- Admins can create competitions
CREATE POLICY "Admins can create competitions"
  ON public.competitions FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Admins can update competitions
CREATE POLICY "Admins can update competitions"
  ON public.competitions FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete competitions
CREATE POLICY "Admins can delete competitions"
  ON public.competitions FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 5. COMPETITION SYLLABUS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to competition_syllabus"
  ON public.competition_syllabus FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 6. COMPETITION PRIZES - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to competition_prizes"
  ON public.competition_prizes FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 7. MOCK TESTS - Admin Full Access
-- ============================================

-- Admins can read all mock tests (including unpublished)
CREATE POLICY "Admins have full read access to mock_tests"
  ON public.mock_tests FOR SELECT
  USING (public.is_admin_user());

-- Admins can create mock tests
CREATE POLICY "Admins can create mock_tests"
  ON public.mock_tests FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Admins can update mock tests
CREATE POLICY "Admins can update mock_tests"
  ON public.mock_tests FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete mock tests
CREATE POLICY "Admins can delete mock_tests"
  ON public.mock_tests FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 8. QUESTION BANKS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to question_banks"
  ON public.question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 9. QUESTIONS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to questions"
  ON public.questions FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 10. QUESTION OPTIONS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to question_options"
  ON public.question_options FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 11. COMPETITION QUESTION BANKS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to competition_question_banks"
  ON public.competition_question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 12. MOCK TEST QUESTION BANKS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to mock_test_question_banks"
  ON public.mock_test_question_banks FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 13. PAYMENTS - Admin Full Access
-- ============================================

-- Admins can read all payments
CREATE POLICY "Admins have full read access to payments"
  ON public.payments FOR SELECT
  USING (public.is_admin_user());

-- Admins can update payment status (for manual corrections)
CREATE POLICY "Admins can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can create payments (for offline/manual payments)
CREATE POLICY "Admins can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 14. ENROLLMENTS - Admin Full Access
-- ============================================

-- Admins can read all enrollments
CREATE POLICY "Admins have full read access to enrollments"
  ON public.enrollments FOR SELECT
  USING (public.is_admin_user());

-- Admins can create enrollments (for offline enrollment)
CREATE POLICY "Admins can create enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (public.is_admin_user());

-- Admins can update enrollments
CREATE POLICY "Admins can update enrollments"
  ON public.enrollments FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete enrollments
CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 15. SUBMISSIONS - Admin Full Access
-- ============================================

-- Admins can read all submissions (for leaderboards, reports)
CREATE POLICY "Admins have full read access to submissions"
  ON public.submissions FOR SELECT
  USING (public.is_admin_user());

-- Admins can update submissions (for score corrections)
CREATE POLICY "Admins can update submissions"
  ON public.submissions FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 16. SUBMISSION ANSWERS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full read access to submission_answers"
  ON public.submission_answers FOR SELECT
  USING (public.is_admin_user());

-- ============================================
-- 17. REFERRER PROFILES - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full access to referrer_profiles"
  ON public.referrer_profiles FOR ALL
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 18. CONTACT REQUESTS - Admin Full Access
-- ============================================

-- Admins can read all contact requests
CREATE POLICY "Admins have full read access to contact_requests"
  ON public.contact_requests FOR SELECT
  USING (public.is_admin_user());

-- Admins can update contact requests (for status changes, responses)
CREATE POLICY "Admins can update contact_requests"
  ON public.contact_requests FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete contact requests (for spam removal)
CREATE POLICY "Admins can delete contact_requests"
  ON public.contact_requests FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 19. DEMO REQUESTS - Admin Full Access
-- ============================================

-- Admins can read all demo requests
CREATE POLICY "Admins have full read access to demo_requests"
  ON public.demo_requests FOR SELECT
  USING (public.is_admin_user());

-- Admins can update demo requests (for status changes, notes)
CREATE POLICY "Admins can update demo_requests"
  ON public.demo_requests FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Admins can delete demo requests
CREATE POLICY "Admins can delete demo_requests"
  ON public.demo_requests FOR DELETE
  USING (public.is_admin_user());

-- ============================================
-- 20. EXAM SESSIONS - Admin Full Access
-- ============================================

-- Admins can read all exam sessions (for monitoring)
CREATE POLICY "Admins have full read access to exam_sessions"
  ON public.exam_sessions FOR SELECT
  USING (public.is_admin_user());

-- Admins can update exam sessions (for unlocking, etc.)
CREATE POLICY "Admins can update exam_sessions"
  ON public.exam_sessions FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- ============================================
-- 21. USER MOCK TEST ATTEMPTS - Admin Full Access
-- ============================================

CREATE POLICY "Admins have full read access to user_mock_test_attempts"
  ON public.user_mock_test_attempts FOR SELECT
  USING (public.is_admin_user());

-- ============================================
-- 22. REFERRERS TABLE (if exists separately)
-- ============================================

-- Check if referrers table exists and add policy
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referrers' AND table_schema = 'public') THEN
    EXECUTE 'CREATE POLICY "Admins have full access to referrers" ON public.referrers FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user())';
  END IF;
END $$;

-- ============================================
-- GRANT PERMISSIONS FOR VIEWS
-- ============================================

-- Ensure admins can access views
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
GRANT SELECT ON public.competitions_with_status TO authenticated;
GRANT SELECT ON public.competition_leaderboard TO authenticated;
GRANT SELECT ON public.user_enrollments_detail TO authenticated;
GRANT SELECT ON public.user_submission_history TO authenticated;
GRANT SELECT ON public.question_banks_summary TO authenticated;
GRANT SELECT ON public.mock_tests_with_status TO authenticated;
