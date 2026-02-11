-- ============================================
-- Migration: Add Admin RLS Policies
-- Description: Allow authenticated admin users to perform CRUD operations
-- ============================================

-- ============================================
-- 1. CREATE HELPER FUNCTION TO CHECK IF USER IS ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() 
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. COMPETITIONS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all competitions (not just published)
CREATE POLICY "Admin can read all competitions"
  ON public.competitions FOR SELECT
  USING (public.is_admin());

-- Admin can create competitions
CREATE POLICY "Admin can create competitions"
  ON public.competitions FOR INSERT
  WITH CHECK (public.is_admin());

-- Admin can update competitions
CREATE POLICY "Admin can update competitions"
  ON public.competitions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin can delete competitions
CREATE POLICY "Admin can delete competitions"
  ON public.competitions FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 3. COMPETITION SYLLABUS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all syllabus"
  ON public.competition_syllabus FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage syllabus"
  ON public.competition_syllabus FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 4. COMPETITION PRIZES - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all prizes"
  ON public.competition_prizes FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage prizes"
  ON public.competition_prizes FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 5. COMPETITION QUESTION BANKS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all competition question banks"
  ON public.competition_question_banks FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage competition question banks"
  ON public.competition_question_banks FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 6. MOCK TESTS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all mock tests"
  ON public.mock_tests FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can create mock tests"
  ON public.mock_tests FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update mock tests"
  ON public.mock_tests FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete mock tests"
  ON public.mock_tests FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 7. MOCK TEST QUESTION BANKS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all mock test question banks"
  ON public.mock_test_question_banks FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage mock test question banks"
  ON public.mock_test_question_banks FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 8. QUESTION BANKS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all question banks"
  ON public.question_banks FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can create question banks"
  ON public.question_banks FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update question banks"
  ON public.question_banks FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete question banks"
  ON public.question_banks FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 9. QUESTIONS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all questions"
  ON public.questions FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can create questions"
  ON public.questions FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update questions"
  ON public.questions FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete questions"
  ON public.questions FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 10. QUESTION OPTIONS - ADD ADMIN POLICIES
-- ============================================

CREATE POLICY "Admin can read all question options"
  ON public.question_options FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admin can manage question options"
  ON public.question_options FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 11. PROFILES - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all profiles (for user management)
CREATE POLICY "Admin can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admin can update profiles (for user management)
CREATE POLICY "Admin can update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 12. ENROLLMENTS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all enrollments
CREATE POLICY "Admin can read all enrollments"
  ON public.enrollments FOR SELECT
  USING (public.is_admin());

-- Admin can manage enrollments
CREATE POLICY "Admin can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 13. PAYMENTS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all payments
CREATE POLICY "Admin can read all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- Admin can update payments (for status changes)
CREATE POLICY "Admin can update payments"
  ON public.payments FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 14. SUBMISSIONS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all submissions
CREATE POLICY "Admin can read all submissions"
  ON public.submissions FOR SELECT
  USING (public.is_admin());

-- Admin can manage submissions
CREATE POLICY "Admin can manage submissions"
  ON public.submissions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 15. SUBMISSION ANSWERS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all submission answers
CREATE POLICY "Admin can read all submission answers"
  ON public.submission_answers FOR SELECT
  USING (public.is_admin());

-- ============================================
-- 16. REFERRER PROFILES - ADD ADMIN POLICIES
-- ============================================

-- Admin can manage referrer profiles
CREATE POLICY "Admin can manage referrer profiles"
  ON public.referrer_profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 17. CONTACT REQUESTS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all contact requests
CREATE POLICY "Admin can read all contact requests"
  ON public.contact_requests FOR SELECT
  USING (public.is_admin());

-- Admin can manage contact requests
CREATE POLICY "Admin can manage contact requests"
  ON public.contact_requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 18. DEMO REQUESTS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all demo requests
CREATE POLICY "Admin can read all demo requests"
  ON public.demo_requests FOR SELECT
  USING (public.is_admin());

-- Admin can manage demo requests
CREATE POLICY "Admin can manage demo requests"
  ON public.demo_requests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 19. USER MOCK TEST ATTEMPTS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all mock test attempts
CREATE POLICY "Admin can read all mock test attempts"
  ON public.user_mock_test_attempts FOR SELECT
  USING (public.is_admin());

-- ============================================
-- 20. EXAM SESSIONS - ADD ADMIN POLICIES
-- ============================================

-- Admin can read all exam sessions
CREATE POLICY "Admin can read all exam sessions"
  ON public.exam_sessions FOR SELECT
  USING (public.is_admin());

-- Admin can manage exam sessions
CREATE POLICY "Admin can manage exam sessions"
  ON public.exam_sessions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 21. ADMIN USERS - ALLOW ADMINS TO READ ADMIN LIST
-- ============================================

-- Admin can read admin_users (for settings page)
CREATE POLICY "Admin can read admin_users"
  ON public.admin_users FOR SELECT
  USING (public.is_admin());
