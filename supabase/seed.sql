-- ============================================
-- Seed Data: Production Export from MongoDB
-- Source: .project/legacy-old-mongodb-data/
-- ============================================

-- ============================================
-- 1. COMPETITIONS
-- ============================================

-- National Abacus Championship 2026
INSERT INTO public.competitions (
  id,
  title,
  slug,
  season,
  description,
  status,
  registration_start_date,
  registration_end_date,
  exam_date,
  exam_window_start,
  exam_window_end,
  results_date,
  duration,
  enrollment_fee,
  original_fee,
  min_grade,
  max_grade,
  is_training_available,
  is_featured,
  is_published,
  is_results_published,
  total_questions,
  total_marks,
  enrolled_count,
  view_count,
  seats_limit,
  waitlist_count,
  created_at,
  updated_at
) VALUES (
  '6924345a-6d0f-f275-e768-25e000000001',
  'National Abacus Championship 2026',
  'national-abacus-championship-2026',
  'Season 1',
  'The ultimate mental math challenge for young geniuses. Compete with 5,000+ students across India and prove your speed and accuracy.',
  'open',
  '2025-11-23T00:00:00.000Z',
  '2025-12-26T23:59:59.000Z',
  '2026-01-26T00:00:00.000Z',
  '2026-01-26T09:00:00.000Z',
  '2026-01-26T21:00:00.000Z',
  '2026-02-10T10:00:00.000Z',
  15,
  500.00,
  1000.00,
  1,
  8,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  60,
  100,
  0,
  0,
  5000,
  0,
  NOW(),
  NOW()
);

-- ============================================
-- 2. COMPETITION SYLLABUS
-- ============================================

INSERT INTO public.competition_syllabus (competition_id, topic, description, sort_order) VALUES
('6924345a-6d0f-f275-e768-25e000000001', 'Addition & Subtraction (1 Digit, 3 Rows)', 'Basic mental calculations for speed and accuracy.', 1),
('6924345a-6d0f-f275-e768-25e000000001', 'Addition & Subtraction (2 Digits, 3 Rows)', 'Intermediate complexity focusing on visualization.', 2),
('6924345a-6d0f-f275-e768-25e000000001', 'Mental Arithmetic (Visualisation)', 'Solving problems without physical abacus tool.', 3),
('6924345a-6d0f-f275-e768-25e000000001', 'Speed Writing Drills', 'Enhancing writing speed to match calculation speed.', 4);

-- ============================================
-- 3. COMPETITION PRIZES
-- ============================================

INSERT INTO public.competition_prizes (competition_id, rank, title, description, worth, prize_type, cash_prize) VALUES
('6924345a-6d0f-f275-e768-25e000000001', 1, 'EV Cycle', 'Gold Medal + Big Trophy', 10000.00, 'trophy', 0),
('6924345a-6d0f-f275-e768-25e000000001', 2, 'Smart Watch', 'Silver Medal + Certificate', 5000.00, 'medal', 0),
('6924345a-6d0f-f275-e768-25e000000001', 3, 'Art Kit', 'Bronze Medal + Certificate', 3000.00, 'medal', 0),
('6924345a-6d0f-f275-e768-25e000000001', 4, 'School Bag & Bottle', 'Consolation Prize', 2000.00, 'certificate', 0),
('6924345a-6d0f-f275-e768-25e000000001', 5, 'Cash Prize', 'Direct Bank Transfer', 1000.00, 'cash', 1000.00);

-- ============================================
-- 4. MOCK TESTS
-- ============================================

-- Mock Test 1: Foundation Level
INSERT INTO public.mock_tests (
  id,
  title,
  description,
  difficulty,
  duration,
  total_questions,
  is_active,
  is_published,
  is_locked,
  min_grade,
  max_grade,
  tags,
  sort_order,
  attempt_count,
  created_at,
  updated_at
) VALUES (
  '692484a4-767b-2be2-c4c2-aad600000001',
  'Foundation Level: Direct Addition',
  'A comprehensive test covering basic bead movements and direct addition/subtraction without formulas. Perfect for Level 1 students starting their journey.',
  'Beginner',
  15,
  25,
  TRUE,
  TRUE,
  FALSE,  -- FREE mock test for users to practice
  1,
  2,
  ARRAY['Level 1', 'Direct Addition', 'Basics', 'No Formulas'],
  1,
  0,
  NOW(),
  NOW()
);

-- Mock Test 2: Small Friends
INSERT INTO public.mock_tests (
  id,
  title,
  description,
  difficulty,
  duration,
  total_questions,
  is_active,
  is_published,
  is_locked,
  min_grade,
  max_grade,
  tags,
  sort_order,
  attempt_count,
  created_at,
  updated_at
) VALUES (
  '692484a4-767b-2be2-c4c2-aad700000002',
  'Small Friends (5 Complements) Drill',
  'Sharpen your skills with the Small Friend formulas. This test focuses on the +5 and -5 complements with double-digit calculations.',
  'Intermediate',
  20,
  40,
  TRUE,
  TRUE,
  TRUE,
  3,
  5,
  ARRAY['Level 3', 'Small Friends', 'Formulas', 'Accuracy'],
  2,
  0,
  NOW(),
  NOW()
);

-- Mock Test 3: Big Friends & Mixed Complements
INSERT INTO public.mock_tests (
  id,
  title,
  description,
  difficulty,
  duration,
  total_questions,
  is_active,
  is_published,
  is_locked,
  min_grade,
  max_grade,
  tags,
  sort_order,
  attempt_count,
  created_at,
  updated_at
) VALUES (
  '692484a4-767b-2be2-c4c2-aad800000003',
  'Big Friends & Mixed Complements',
  'Advanced challenges involving Big Friends (+10/-10) and mixed combinations. Requires strong logical thinking and rapid bead manipulation.',
  'Advanced',
  30,
  50,
  TRUE,
  TRUE,
  TRUE,
  5,
  8,
  ARRAY['Level 5', 'Big Friends', 'Mixed Complements', 'Speed'],
  3,
  0,
  NOW(),
  NOW()
);

-- Mock Test 4: National Championship Prep
INSERT INTO public.mock_tests (
  id,
  title,
  description,
  difficulty,
  duration,
  total_questions,
  is_active,
  is_published,
  is_locked,
  min_grade,
  max_grade,
  tags,
  sort_order,
  attempt_count,
  created_at,
  updated_at
) VALUES (
  '692484a4-767b-2be2-c4c2-aad900000004',
  'National Championship Prep: Anzan',
  'Expert-level mental arithmetic (Anzan) simulation. High-speed flashing numbers with no physical abacus allowed. Designed for championship contenders.',
  'Expert',
  45,
  100,
  TRUE,
  TRUE,
  TRUE,
  6,
  12,
  ARRAY['Anzan', 'Mental Math', 'Championship', 'Visualization'],
  4,
  0,
  NOW(),
  NOW()
);

-- ============================================
-- 5. SAMPLE REFERRER PROFILE
-- ============================================

INSERT INTO public.referrer_profiles (
  id,
  name,
  phone,
  email,
  referral_code,
  total_referrals,
  successful_conversions
) VALUES (
  gen_random_uuid(),
  'Wisdom Abacus Academy',
  '+919876543210',
  'partner@wisdomabacus.com',
  'WISDOM2026',
  0,
  0
);