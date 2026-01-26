-- ============================================
-- Migration: 003_create_triggers_and_functions
-- Description: Auto-update triggers, UID generation, and helper functions
-- ============================================

-- ============================================
-- 1. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mock_tests_updated_at
  BEFORE UPDATE ON public.mock_tests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_question_banks_updated_at
  BEFORE UPDATE ON public.question_banks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referrer_profiles_updated_at
  BEFORE UPDATE ON public.referrer_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON public.demo_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exam_sessions_updated_at
  BEFORE UPDATE ON public.exam_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. AUTO-GENERATE UID FOR PROFILES (WA prefix)
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_user_uid()
RETURNS TRIGGER AS $$
DECLARE
  timestamp_part TEXT;
  random_part TEXT;
BEGIN
  IF NEW.uid IS NULL OR NEW.uid = '' THEN
    -- Generate timestamp in base36 (uppercase)
    timestamp_part := UPPER(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT));
    -- Generate random 6 character string
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    NEW.uid := 'WA' || timestamp_part || random_part;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_profile_uid
  BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.generate_user_uid();

-- ============================================
-- 3. AUTO-CALCULATE QUESTION BANK TOTAL MARKS
-- ============================================
CREATE OR REPLACE FUNCTION public.update_question_bank_total_marks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.question_banks
  SET total_marks = (
    SELECT COALESCE(SUM(marks), 0)
    FROM public.questions
    WHERE question_bank_id = COALESCE(NEW.question_bank_id, OLD.question_bank_id)
  )
  WHERE id = COALESCE(NEW.question_bank_id, OLD.question_bank_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_qb_total_marks_on_insert
  AFTER INSERT ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_question_bank_total_marks();

CREATE TRIGGER update_qb_total_marks_on_update
  AFTER UPDATE OF marks ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_question_bank_total_marks();

CREATE TRIGGER update_qb_total_marks_on_delete
  AFTER DELETE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_question_bank_total_marks();

-- ============================================
-- 4. INCREMENT COMPETITION ENROLLED COUNT
-- ============================================
CREATE OR REPLACE FUNCTION public.update_competition_enrolled_count()
RETURNS TRIGGER AS $$
BEGIN
  -- When enrollment is confirmed
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.competitions
    SET enrolled_count = enrolled_count + 1
    WHERE id = NEW.competition_id;
  END IF;
  
  -- When enrollment is cancelled
  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE public.competitions
    SET enrolled_count = GREATEST(0, enrolled_count - 1)
    WHERE id = NEW.competition_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_competition_enrolled_count_trigger
  AFTER UPDATE OF status ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_competition_enrolled_count();

-- ============================================
-- 5. TRACK REFERRAL CONVERSION
-- ============================================
CREATE OR REPLACE FUNCTION public.track_referral_conversion()
RETURNS TRIGGER AS $$
BEGIN
  -- When enrollment is confirmed and has attribution code
  IF NEW.status = 'confirmed' AND NEW.attribution_code IS NOT NULL 
     AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE public.referrer_profiles
    SET successful_conversions = successful_conversions + 1
    WHERE referral_code = NEW.attribution_code;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_referral_conversion_trigger
  AFTER UPDATE OF status ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.track_referral_conversion();

-- ============================================
-- 6. INCREMENT MOCK TEST ATTEMPT COUNT
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_mock_test_attempts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mock_tests
  SET attempt_count = attempt_count + 1
  WHERE id = NEW.mock_test_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_mock_test_attempts_trigger
  AFTER INSERT ON public.user_mock_test_attempts
  FOR EACH ROW EXECUTE FUNCTION public.increment_mock_test_attempts();

-- ============================================
-- 7. HELPER FUNCTION: IS ADMIN
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = user_id AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. HELPER FUNCTION: IS REGISTRATION OPEN
-- ============================================
CREATE OR REPLACE FUNCTION public.is_registration_open(competition_row public.competitions)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    competition_row.status = 'open' AND
    NOW() >= competition_row.registration_start_date AND
    NOW() <= competition_row.registration_end_date
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. CLEANUP EXPIRED EXAM SESSIONS (called periodically)
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_exam_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.exam_sessions
  WHERE expires_at < NOW()
  RETURNING COUNT(*) INTO deleted_count;
  
  RETURN COALESCE(deleted_count, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. CALCULATE SUBMISSION SCORE
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_submission_score(p_submission_id UUID)
RETURNS TABLE(
  total_score INTEGER,
  correct_count INTEGER,
  incorrect_count INTEGER,
  unanswered_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN sa.is_correct THEN sa.marks ELSE 0 END), 0)::INTEGER AS total_score,
    COUNT(CASE WHEN sa.is_correct THEN 1 END)::INTEGER AS correct_count,
    COUNT(CASE WHEN NOT sa.is_correct AND sa.selected_option_index >= 0 THEN 1 END)::INTEGER AS incorrect_count,
    (s.total_questions - COUNT(sa.id))::INTEGER AS unanswered_count
  FROM public.submissions s
  LEFT JOIN public.submission_answers sa ON sa.submission_id = s.id
  WHERE s.id = p_submission_id
  GROUP BY s.id, s.total_questions;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. CREATE PROFILE ON AUTH USER CREATION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'google'
      WHEN NEW.phone IS NOT NULL THEN 'phone'
      ELSE 'email'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
