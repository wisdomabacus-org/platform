-- ============================================
-- Migration: 002_create_transaction_tables
-- Description: Create payments, enrollments, submissions, and exam sessions
-- ============================================

-- ============================================
-- 1. PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  amount INTEGER NOT NULL, -- Amount in paise (smallest currency unit)
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
  gateway TEXT DEFAULT 'RAZORPAY',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  purpose TEXT NOT NULL CHECK (purpose IN ('COMPETITION_ENROLLMENT', 'SUBSCRIPTION_PURCHASE')),
  reference_id UUID NOT NULL, -- Competition ID or Subscription ID
  gst_amount INTEGER DEFAULT 0,
  base_amount INTEGER DEFAULT 0,
  
  -- User snapshot at time of payment
  user_snapshot JSONB DEFAULT '{}',
  
  failure_reason TEXT,
  gateway_response JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON public.payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- ============================================
-- 2. ENROLLMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE RESTRICT,
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
  submission_id UUID, -- Will be set when exam is submitted
  is_payment_confirmed BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  
  -- Snapshots at enrollment time
  competition_snapshot JSONB NOT NULL DEFAULT '{}',
  user_snapshot JSONB NOT NULL DEFAULT '{}',
  
  -- Referral attribution
  attribution_code TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate enrollments
  UNIQUE(user_id, competition_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_competition_id ON public.enrollments(competition_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_id ON public.enrollments(payment_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON public.enrollments(created_at DESC);

-- ============================================
-- 3. SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('competition', 'mock-test')),
  competition_id UUID REFERENCES public.competitions(id) ON DELETE RESTRICT,
  mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE RESTRICT,
  
  -- Exam snapshot at submission time
  exam_snapshot JSONB NOT NULL DEFAULT '{}',
  
  -- Results
  score INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  unanswered INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMPTZ NOT NULL,
  submitted_at TIMESTAMPTZ,
  time_taken INTEGER, -- seconds
  
  -- Competition ranking
  rank INTEGER,
  
  status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'auto-submitted')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure either competition_id or mock_test_id is set
  CONSTRAINT submission_exam_reference CHECK (
    (exam_type = 'competition' AND competition_id IS NOT NULL AND mock_test_id IS NULL) OR
    (exam_type = 'mock-test' AND mock_test_id IS NOT NULL AND competition_id IS NULL)
  )
);

-- Unique constraint: One submission per user per competition
CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_user_competition 
  ON public.submissions(user_id, competition_id) 
  WHERE competition_id IS NOT NULL;

-- Unique constraint: One submission per user per mock test
CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_user_mocktest 
  ON public.submissions(user_id, mock_test_id) 
  WHERE mock_test_id IS NOT NULL;

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_competition_id ON public.submissions(competition_id);
CREATE INDEX IF NOT EXISTS idx_submissions_mock_test_id ON public.submissions(mock_test_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- Leaderboard index (competition, score descending, submitted_at ascending)
CREATE INDEX IF NOT EXISTS idx_submissions_leaderboard 
  ON public.submissions(competition_id, score DESC, submitted_at ASC) 
  WHERE exam_type = 'competition' AND status = 'completed';

-- ============================================
-- 4. SUBMISSION ANSWERS (normalized from submissions.answers array)
-- ============================================
CREATE TABLE IF NOT EXISTS public.submission_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
  question_text TEXT, -- Snapshot for history
  selected_option_index INTEGER NOT NULL,
  correct_option_index INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  marks INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ,
  
  UNIQUE(submission_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_submission_answers_submission_id ON public.submission_answers(submission_id);

-- ============================================
-- 5. USER MOCK TEST ATTEMPTS (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mock_test_id UUID NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, mock_test_id)
);

CREATE INDEX IF NOT EXISTS idx_user_mock_test_attempts_user_id ON public.user_mock_test_attempts(user_id);

-- ============================================
-- 6. EXAM SESSIONS (replaces Redis for exam state)
-- ============================================
CREATE TABLE IF NOT EXISTS public.exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL, -- UUID token for API access
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('competition', 'mock-test')),
  exam_id UUID NOT NULL, -- Competition or Mock Test ID
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  
  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Session state
  answers JSONB DEFAULT '{}', -- { questionId: { selectedOptionIndex, answeredAt } }
  status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'submitted', 'expired')),
  is_locked BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- TTL: Sessions expire based on end_time + buffer
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exam_sessions_session_token ON public.exam_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user_id ON public.exam_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_submission_id ON public.exam_sessions(submission_id);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_status ON public.exam_sessions(status);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_expires_at ON public.exam_sessions(expires_at);

-- ============================================
-- 7. ADD FOREIGN KEY FOR ENROLLMENT SUBMISSION
-- ============================================
ALTER TABLE public.enrollments 
  ADD CONSTRAINT fk_enrollment_submission 
  FOREIGN KEY (submission_id) 
  REFERENCES public.submissions(id) 
  ON DELETE SET NULL;
