-- ============================================
-- Migration: 001_create_core_tables
-- Description: Create core tables for Wisdom Abacus platform
-- ============================================

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uid TEXT UNIQUE NOT NULL,
  auth_provider TEXT NOT NULL CHECK (auth_provider IN ('email', 'phone', 'google')),
  phone TEXT UNIQUE,
  email TEXT,
  parent_name TEXT,
  student_name TEXT,
  student_grade INTEGER CHECK (student_grade BETWEEN 1 AND 12),
  school_name TEXT,
  city TEXT,
  state TEXT,
  date_of_birth DATE,
  is_profile_complete BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  referred_by_code TEXT,
  referral_source TEXT CHECK (referral_source IN ('LINK', 'MANUAL_INPUT')),
  registration_source TEXT DEFAULT 'WEB' CHECK (registration_source IN ('WEB', 'WHATSAPP')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for UID lookups
CREATE INDEX IF NOT EXISTS idx_profiles_uid ON public.profiles(uid);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by_code ON public.profiles(referred_by_code);

-- ============================================
-- 2. ADMIN USERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. COMPETITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  season TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('open', 'closed', 'upcoming', 'completed', 'live')),
  registration_start_date TIMESTAMPTZ NOT NULL,
  registration_end_date TIMESTAMPTZ NOT NULL,
  exam_date TIMESTAMPTZ NOT NULL,
  exam_window_start TIMESTAMPTZ NOT NULL,
  exam_window_end TIMESTAMPTZ NOT NULL,
  results_date TIMESTAMPTZ,
  duration INTEGER NOT NULL, -- minutes
  enrollment_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  original_fee NUMERIC(10,2),
  min_grade INTEGER NOT NULL CHECK (min_grade BETWEEN 1 AND 12),
  max_grade INTEGER NOT NULL CHECK (max_grade BETWEEN 1 AND 12),
  total_questions INTEGER DEFAULT 0,
  total_marks INTEGER DEFAULT 0,
  enrolled_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  seats_limit INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_results_published BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_training_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_grade_range CHECK (min_grade <= max_grade)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_competitions_slug ON public.competitions(slug);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_is_published ON public.competitions(is_published);
CREATE INDEX IF NOT EXISTS idx_competitions_is_featured ON public.competitions(is_featured);

-- ============================================
-- 4. COMPETITION SYLLABUS (normalized from array)
-- ============================================
CREATE TABLE IF NOT EXISTS public.competition_syllabus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_competition_syllabus_competition_id ON public.competition_syllabus(competition_id);

-- ============================================
-- 5. COMPETITION PRIZES (normalized from array)
-- ============================================
CREATE TABLE IF NOT EXISTS public.competition_prizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL CHECK (rank >= 1),
  title TEXT NOT NULL,
  description TEXT,
  cash_prize NUMERIC(10,2) DEFAULT 0,
  worth NUMERIC(10,2),
  prize_type TEXT DEFAULT 'medal' CHECK (prize_type IN ('trophy', 'medal', 'certificate', 'cash')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(competition_id, rank)
);

CREATE INDEX IF NOT EXISTS idx_competition_prizes_competition_id ON public.competition_prizes(competition_id);

-- ============================================
-- 6. MOCK TESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  duration INTEGER NOT NULL, -- minutes
  total_questions INTEGER NOT NULL,
  min_grade INTEGER DEFAULT 1 CHECK (min_grade BETWEEN 1 AND 12),
  max_grade INTEGER DEFAULT 12 CHECK (max_grade BETWEEN 1 AND 12),
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  attempt_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_mock_grade_range CHECK (min_grade <= max_grade)
);

CREATE INDEX IF NOT EXISTS idx_mock_tests_is_published ON public.mock_tests(is_published);

-- ============================================
-- 7. QUESTION BANKS
-- ============================================
CREATE TABLE IF NOT EXISTS public.question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  min_grade INTEGER CHECK (min_grade BETWEEN 1 AND 12),
  max_grade INTEGER CHECK (max_grade BETWEEN 1 AND 12),
  tags TEXT[] DEFAULT '{}',
  total_marks INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. QUESTIONS (normalized from question_banks.questions array)
-- ============================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_bank_id UUID NOT NULL REFERENCES public.question_banks(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  image_url TEXT,
  correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0),
  marks INTEGER DEFAULT 1 CHECK (marks > 0),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_question_bank_id ON public.questions(question_bank_id);

-- ============================================
-- 9. QUESTION OPTIONS (normalized from questions.options array)
-- ============================================
CREATE TABLE IF NOT EXISTS public.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL CHECK (option_index >= 0),
  text TEXT NOT NULL,
  
  UNIQUE(question_id, option_index)
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);

-- ============================================
-- 10. COMPETITION QUESTION BANKS (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.competition_question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  question_bank_id UUID NOT NULL REFERENCES public.question_banks(id) ON DELETE CASCADE,
  grades INTEGER[] NOT NULL, -- Array of grades this question bank applies to
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(competition_id, question_bank_id)
);

CREATE INDEX IF NOT EXISTS idx_competition_question_banks_competition_id ON public.competition_question_banks(competition_id);

-- ============================================
-- 11. MOCK TEST QUESTION BANKS (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.mock_test_question_banks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mock_test_id UUID NOT NULL REFERENCES public.mock_tests(id) ON DELETE CASCADE,
  question_bank_id UUID NOT NULL REFERENCES public.question_banks(id) ON DELETE CASCADE,
  grades INTEGER[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(mock_test_id, question_bank_id)
);

CREATE INDEX IF NOT EXISTS idx_mock_test_question_banks_mock_test_id ON public.mock_test_question_banks(mock_test_id);

-- ============================================
-- 12. REFERRER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS public.referrer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  successful_conversions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrer_profiles_referral_code ON public.referrer_profiles(referral_code);

-- ============================================
-- 13. CONTACT REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT DEFAULT 'general' CHECK (subject IN ('admissions', 'technical', 'general', 'partnership')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'spam')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. DEMO REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 0 AND 12),
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('weekend', 'weekday')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'cancelled')),
  admin_notes TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
