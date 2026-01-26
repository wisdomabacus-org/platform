-- ============================================
-- Migration: 004_create_rls_policies
-- Description: Row Level Security policies for all tables
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_test_question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mock_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 1. PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role can do everything (for Edge Functions)
CREATE POLICY "Service role has full access to profiles"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 2. ADMIN USERS POLICIES (service role only)
-- ============================================
CREATE POLICY "Service role has full access to admin_users"
  ON public.admin_users FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 3. COMPETITIONS POLICIES
-- ============================================

-- Anyone can read published competitions
CREATE POLICY "Anyone can read published competitions"
  ON public.competitions FOR SELECT
  USING (is_published = TRUE);

-- Service role can do everything
CREATE POLICY "Service role has full access to competitions"
  ON public.competitions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 4. COMPETITION SYLLABUS POLICIES
-- ============================================

-- Read syllabus for published competitions
CREATE POLICY "Anyone can read syllabus for published competitions"
  ON public.competition_syllabus FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions 
      WHERE id = competition_id AND is_published = TRUE
    )
  );

CREATE POLICY "Service role has full access to competition_syllabus"
  ON public.competition_syllabus FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 5. COMPETITION PRIZES POLICIES
-- ============================================

CREATE POLICY "Anyone can read prizes for published competitions"
  ON public.competition_prizes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.competitions 
      WHERE id = competition_id AND is_published = TRUE
    )
  );

CREATE POLICY "Service role has full access to competition_prizes"
  ON public.competition_prizes FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 6. MOCK TESTS POLICIES
-- ============================================

CREATE POLICY "Anyone can read published mock tests"
  ON public.mock_tests FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Service role has full access to mock_tests"
  ON public.mock_tests FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 7. QUESTION BANKS POLICIES (restricted access)
-- ============================================

-- Question banks are only accessible via Edge Functions
CREATE POLICY "Service role has full access to question_banks"
  ON public.question_banks FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 8. QUESTIONS POLICIES (restricted access)
-- ============================================

CREATE POLICY "Service role has full access to questions"
  ON public.questions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 9. QUESTION OPTIONS POLICIES (restricted access)
-- ============================================

CREATE POLICY "Service role has full access to question_options"
  ON public.question_options FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 10. JUNCTION TABLE POLICIES
-- ============================================

CREATE POLICY "Service role has full access to competition_question_banks"
  ON public.competition_question_banks FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to mock_test_question_banks"
  ON public.mock_test_question_banks FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 11. REFERRER PROFILES POLICIES
-- ============================================

-- Public can read referral codes (for validation)
CREATE POLICY "Anyone can read referrer profiles"
  ON public.referrer_profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Service role has full access to referrer_profiles"
  ON public.referrer_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 12. CONTACT REQUESTS POLICIES
-- ============================================

-- Anyone can create contact requests
CREATE POLICY "Anyone can create contact requests"
  ON public.contact_requests FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Service role has full access to contact_requests"
  ON public.contact_requests FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 13. DEMO REQUESTS POLICIES
-- ============================================

CREATE POLICY "Anyone can create demo requests"
  ON public.demo_requests FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Service role has full access to demo_requests"
  ON public.demo_requests FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 14. PAYMENTS POLICIES
-- ============================================

-- Users can read their own payments
CREATE POLICY "Users can read own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to payments"
  ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 15. ENROLLMENTS POLICIES
-- ============================================

-- Users can read their own enrollments
CREATE POLICY "Users can read own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to enrollments"
  ON public.enrollments FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 16. SUBMISSIONS POLICIES
-- ============================================

-- Users can read their own submissions
CREATE POLICY "Users can read own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to submissions"
  ON public.submissions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 17. SUBMISSION ANSWERS POLICIES
-- ============================================

-- Users can read their own submission answers
CREATE POLICY "Users can read own submission answers"
  ON public.submission_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions 
      WHERE id = submission_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Service role has full access to submission_answers"
  ON public.submission_answers FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 18. USER MOCK TEST ATTEMPTS POLICIES
-- ============================================

CREATE POLICY "Users can read own mock test attempts"
  ON public.user_mock_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to user_mock_test_attempts"
  ON public.user_mock_test_attempts FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 19. EXAM SESSIONS POLICIES
-- ============================================

-- Users can read their own exam sessions
CREATE POLICY "Users can read own exam sessions"
  ON public.exam_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to exam_sessions"
  ON public.exam_sessions FOR ALL
  USING (auth.role() = 'service_role');
