-- ============================================
-- Migration: 005_create_views
-- Description: Views for computed fields, leaderboards, and common queries
-- ============================================

-- ============================================
-- 1. COMPETITIONS WITH COMPUTED FIELDS
-- ============================================
CREATE OR REPLACE VIEW public.competitions_with_status AS
SELECT 
  c.*,
  -- is_registration_open computed field
  (
    c.status = 'open' AND
    NOW() >= c.registration_start_date AND
    NOW() <= c.registration_end_date
  ) AS is_registration_open,
  -- seats_remaining
  CASE 
    WHEN c.seats_limit > 0 THEN GREATEST(0, c.seats_limit - c.enrolled_count)
    ELSE NULL
  END AS seats_remaining,
  -- is_exam_active
  (
    NOW() >= c.exam_window_start AND
    NOW() <= c.exam_window_end
  ) AS is_exam_active
FROM public.competitions c;

-- ============================================
-- 2. MOCK TESTS WITH STATUS
-- ============================================
CREATE OR REPLACE VIEW public.mock_tests_with_status AS
SELECT 
  m.*,
  CASE 
    WHEN m.is_active THEN 'unlocked'
    ELSE 'locked'
  END AS status
FROM public.mock_tests m;

-- ============================================
-- 3. COMPETITION LEADERBOARD
-- ============================================
CREATE OR REPLACE VIEW public.competition_leaderboard AS
SELECT 
  s.id AS submission_id,
  s.competition_id,
  s.user_id,
  p.student_name,
  p.student_grade,
  p.school_name,
  p.city,
  s.score,
  s.correct_answers,
  s.total_questions,
  s.time_taken,
  s.submitted_at,
  RANK() OVER (
    PARTITION BY s.competition_id 
    ORDER BY s.score DESC, s.time_taken ASC, s.submitted_at ASC
  ) AS rank
FROM public.submissions s
JOIN public.profiles p ON p.id = s.user_id
WHERE s.exam_type = 'competition'
  AND s.status = 'completed'
  AND s.competition_id IS NOT NULL;

-- ============================================
-- 4. USER ENROLLMENTS WITH DETAILS
-- ============================================
CREATE OR REPLACE VIEW public.user_enrollments_detail AS
SELECT 
  e.id AS enrollment_id,
  e.user_id,
  e.competition_id,
  e.status AS enrollment_status,
  e.is_payment_confirmed,
  e.competition_snapshot,
  e.created_at AS enrolled_at,
  c.title AS competition_title,
  c.slug AS competition_slug,
  c.exam_date,
  c.exam_window_start,
  c.exam_window_end,
  c.duration,
  c.status AS competition_status,
  -- Can start exam?
  (
    e.status = 'confirmed' AND
    e.is_payment_confirmed = TRUE AND
    NOW() >= c.exam_window_start AND
    NOW() <= c.exam_window_end AND
    NOT EXISTS (
      SELECT 1 FROM public.submissions s 
      WHERE s.user_id = e.user_id 
        AND s.competition_id = e.competition_id
        AND s.status IN ('completed', 'auto-submitted')
    )
  ) AS can_start_exam,
  -- Has submitted?
  EXISTS (
    SELECT 1 FROM public.submissions s 
    WHERE s.user_id = e.user_id 
      AND s.competition_id = e.competition_id
  ) AS has_submitted,
  -- Submission ID if exists
  (
    SELECT s.id FROM public.submissions s 
    WHERE s.user_id = e.user_id 
      AND s.competition_id = e.competition_id
    LIMIT 1
  ) AS submission_id
FROM public.enrollments e
JOIN public.competitions c ON c.id = e.competition_id;

-- ============================================
-- 5. USER SUBMISSION HISTORY
-- ============================================
CREATE OR REPLACE VIEW public.user_submission_history AS
SELECT 
  s.id AS submission_id,
  s.user_id,
  s.exam_type,
  s.competition_id,
  s.mock_test_id,
  s.exam_snapshot,
  s.score,
  s.total_questions,
  s.correct_answers,
  s.incorrect_answers,
  s.unanswered,
  s.time_taken,
  s.status,
  s.rank,
  s.submitted_at,
  s.started_at,
  -- Exam title
  COALESCE(
    (s.exam_snapshot->>'title'),
    c.title,
    m.title
  ) AS exam_title,
  -- Percentage score
  CASE 
    WHEN (s.exam_snapshot->>'totalMarks')::INTEGER > 0 
    THEN ROUND((s.score::NUMERIC / (s.exam_snapshot->>'totalMarks')::NUMERIC) * 100, 2)
    ELSE 0
  END AS percentage_score
FROM public.submissions s
LEFT JOIN public.competitions c ON c.id = s.competition_id
LEFT JOIN public.mock_tests m ON m.id = s.mock_test_id;

-- ============================================
-- 6. QUESTION BANK WITH QUESTION COUNT
-- ============================================
CREATE OR REPLACE VIEW public.question_banks_summary AS
SELECT 
  qb.id,
  qb.title,
  qb.description,
  qb.min_grade,
  qb.max_grade,
  qb.tags,
  qb.total_marks,
  qb.is_active,
  qb.created_at,
  COUNT(q.id) AS question_count
FROM public.question_banks qb
LEFT JOIN public.questions q ON q.question_bank_id = qb.id
GROUP BY qb.id;

-- ============================================
-- 7. ADMIN DASHBOARD STATS
-- ============================================
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) AS total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE created_at > NOW() - INTERVAL '30 days') AS new_users_30d,
  (SELECT COUNT(*) FROM public.enrollments WHERE status = 'confirmed') AS total_enrollments,
  (SELECT COUNT(*) FROM public.payments WHERE status = 'SUCCESS') AS successful_payments,
  (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'SUCCESS') AS total_revenue_paise,
  (SELECT COUNT(*) FROM public.submissions WHERE status = 'completed') AS total_submissions,
  (SELECT COUNT(*) FROM public.competitions WHERE is_published = TRUE) AS active_competitions,
  (SELECT COUNT(*) FROM public.mock_tests WHERE is_published = TRUE) AS active_mock_tests;

-- ============================================
-- 8. GRANT SELECT ON VIEWS
-- ============================================
GRANT SELECT ON public.competitions_with_status TO authenticated;
GRANT SELECT ON public.mock_tests_with_status TO authenticated;
GRANT SELECT ON public.competition_leaderboard TO authenticated;
GRANT SELECT ON public.user_enrollments_detail TO authenticated;
GRANT SELECT ON public.user_submission_history TO authenticated;
GRANT SELECT ON public.question_banks_summary TO authenticated;
GRANT SELECT ON public.admin_dashboard_stats TO authenticated;
