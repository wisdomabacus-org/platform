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

-- ============================================
-- 6. QUESTION BANKS
-- ============================================

-- Question Bank 1: UKG to Grade 2 - Basic Addition
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000001',
  'Basic Addition - Beginners',
  'Simple 1-digit addition problems for UKG to Grade 2. Focus on direct bead movements without formulas.',
  'competition',
  'published',
  0,
  2,
  TRUE,
  ARRAY['Beginner', 'Addition', '1-Digit', 'No Formulas'],
  25,
  NOW(),
  NOW()
);

-- Question Bank 2: Grade 1-3 - Subtraction Basics
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000002',
  'Subtraction Basics - Level 1',
  '1-digit subtraction problems. Introduces the concept of taking away beads.',
  'competition',
  'published',
  1,
  3,
  TRUE,
  ARRAY['Beginner', 'Subtraction', '1-Digit'],
  25,
  NOW(),
  NOW()
);

-- Question Bank 3: Grade 3-5 - Mixed Operations
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000003',
  'Mixed Operations - Intermediate',
  '2-digit mixed addition and subtraction. Introduces Small Friend formulas (5 complements).',
  'competition',
  'published',
  3,
  5,
  TRUE,
  ARRAY['Intermediate', 'Mixed', '2-Digit', 'Small Friends'],
  50,
  NOW(),
  NOW()
);

-- Question Bank 4: Grade 5-8 - Advanced Calculations
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000004',
  'Advanced Calculations - Big Friends',
  '2-3 digit operations involving Big Friend formulas (10 complements). For advanced students.',
  'competition',
  'published',
  5,
  8,
  TRUE,
  ARRAY['Advanced', 'Big Friends', '3-Digit', 'Speed'],
  75,
  NOW(),
  NOW()
);

-- Question Bank 5: Mock Test Bank - Foundation
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000005',
  'Mock Test - Foundation Level',
  'Questions for Foundation Level Mock Test. Simple 1-digit addition operations.',
  'mock_test',
  'published',
  1,
  2,
  TRUE,
  ARRAY['Mock', 'Foundation', 'Level 1'],
  25,
  NOW(),
  NOW()
);

-- Question Bank 6: Mock Test Bank - Intermediate
INSERT INTO public.question_banks (
  id,
  title,
  description,
  bank_type,
  status,
  min_grade,
  max_grade,
  is_active,
  tags,
  total_marks,
  created_at,
  updated_at
) VALUES (
  '1b000001-0001-0001-0001-000000000006',
  'Mock Test - Small Friends Drill',
  'Questions for Small Friends Mock Test. 2-digit operations with 5 complements.',
  'mock_test',
  'published',
  3,
  5,
  TRUE,
  ARRAY['Mock', 'Small Friends', 'Level 3'],
  40,
  NOW(),
  NOW()
);

-- ============================================
-- 7. QUESTIONS (Abacus-style)
-- ============================================

-- Questions for Bank 1: Basic Addition (UKG-G2) - Simple 1-digit, 3 rows
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('10000001-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000001', '2 + 3 + 4', 'abacus', '[2, 3, 4]', 'addition', 9, 0, 1, 3, 1, TRUE, 1),
('10000001-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000001', '1 + 5 + 2', 'abacus', '[1, 5, 2]', 'addition', 8, 1, 1, 3, 1, TRUE, 2),
('10000001-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000001', '4 + 4 + 1', 'abacus', '[4, 4, 1]', 'addition', 9, 2, 1, 3, 1, TRUE, 3),
('10000001-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000001', '3 + 2 + 4', 'abacus', '[3, 2, 4]', 'addition', 9, 0, 1, 3, 1, TRUE, 4),
('10000001-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000001', '5 + 1 + 3', 'abacus', '[5, 1, 3]', 'addition', 9, 3, 1, 3, 1, TRUE, 5),
('10000001-0001-0001-0001-000000000006', '1b000001-0001-0001-0001-000000000001', '2 + 2 + 5', 'abacus', '[2, 2, 5]', 'addition', 9, 1, 1, 3, 1, TRUE, 6),
('10000001-0001-0001-0001-000000000007', '1b000001-0001-0001-0001-000000000001', '1 + 4 + 3', 'abacus', '[1, 4, 3]', 'addition', 8, 2, 1, 3, 1, TRUE, 7),
('10000001-0001-0001-0001-000000000008', '1b000001-0001-0001-0001-000000000001', '3 + 3 + 2', 'abacus', '[3, 3, 2]', 'addition', 8, 0, 1, 3, 1, TRUE, 8),
('10000001-0001-0001-0001-000000000009', '1b000001-0001-0001-0001-000000000001', '6 + 1 + 2', 'abacus', '[6, 1, 2]', 'addition', 9, 3, 1, 3, 1, TRUE, 9),
('10000001-0001-0001-0001-000000000010', '1b000001-0001-0001-0001-000000000001', '4 + 2 + 3', 'abacus', '[4, 2, 3]', 'addition', 9, 1, 1, 3, 1, TRUE, 10);

-- Questions for Bank 2: Subtraction Basics (G1-G3)
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('20000002-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000002', '9 - 3 - 2', 'abacus', '[9, -3, -2]', 'subtraction', 4, 0, 1, 3, 1, TRUE, 1),
('20000002-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000002', '8 - 2 - 4', 'abacus', '[8, -2, -4]', 'subtraction', 2, 1, 1, 3, 1, TRUE, 2),
('20000002-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000002', '7 - 1 - 3', 'abacus', '[7, -1, -3]', 'subtraction', 3, 2, 1, 3, 1, TRUE, 3),
('20000002-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000002', '9 - 4 - 1', 'abacus', '[9, -4, -1]', 'subtraction', 4, 0, 1, 3, 1, TRUE, 4),
('20000002-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000002', '6 - 2 - 1', 'abacus', '[6, -2, -1]', 'subtraction', 3, 3, 1, 3, 1, TRUE, 5),
('20000002-0001-0001-0001-000000000006', '1b000001-0001-0001-0001-000000000002', '8 - 3 - 1', 'abacus', '[8, -3, -1]', 'subtraction', 4, 1, 1, 3, 1, TRUE, 6),
('20000002-0001-0001-0001-000000000007', '1b000001-0001-0001-0001-000000000002', '9 - 2 - 5', 'abacus', '[9, -2, -5]', 'subtraction', 2, 2, 1, 3, 1, TRUE, 7),
('20000002-0001-0001-0001-000000000008', '1b000001-0001-0001-0001-000000000002', '7 - 3 - 2', 'abacus', '[7, -3, -2]', 'subtraction', 2, 0, 1, 3, 1, TRUE, 8),
('20000002-0001-0001-0001-000000000009', '1b000001-0001-0001-0001-000000000002', '5 - 1 - 2', 'abacus', '[5, -1, -2]', 'subtraction', 2, 3, 1, 3, 1, TRUE, 9),
('20000002-0001-0001-0001-000000000010', '1b000001-0001-0001-0001-000000000002', '9 - 5 - 2', 'abacus', '[9, -5, -2]', 'subtraction', 2, 1, 1, 3, 1, TRUE, 10);

-- Questions for Bank 3: Mixed Operations (G3-G5) - 2 digits
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('30000003-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000003', '15 + 23 - 12', 'abacus', '[15, 23, -12]', 'mixed', 26, 0, 2, 3, 2, TRUE, 1),
('30000003-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000003', '34 - 11 + 22', 'abacus', '[34, -11, 22]', 'mixed', 45, 1, 2, 3, 2, TRUE, 2),
('30000003-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000003', '28 + 15 - 8', 'abacus', '[28, 15, -8]', 'mixed', 35, 2, 2, 3, 2, TRUE, 3),
('30000003-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000003', '41 - 19 + 23', 'abacus', '[41, -19, 23]', 'mixed', 45, 0, 2, 3, 2, TRUE, 4),
('30000003-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000003', '56 + 12 - 33', 'abacus', '[56, 12, -33]', 'mixed', 35, 3, 2, 3, 2, TRUE, 5),
('30000003-0001-0001-0001-000000000006', '1b000001-0001-0001-0001-000000000003', '27 - 14 + 32', 'abacus', '[27, -14, 32]', 'mixed', 45, 1, 2, 3, 2, TRUE, 6),
('30000003-0001-0001-0001-000000000007', '1b000001-0001-0001-0001-000000000003', '63 + 21 - 49', 'abacus', '[63, 21, -49]', 'mixed', 35, 2, 2, 3, 2, TRUE, 7),
('30000003-0001-0001-0001-000000000008', '1b000001-0001-0001-0001-000000000003', '45 - 28 + 38', 'abacus', '[45, -28, 38]', 'mixed', 55, 0, 2, 3, 2, TRUE, 8),
('30000003-0001-0001-0001-000000000009', '1b000001-0001-0001-0001-000000000003', '72 + 13 - 40', 'abacus', '[72, 13, -40]', 'mixed', 45, 3, 2, 3, 2, TRUE, 9),
('30000003-0001-0001-0001-000000000010', '1b000001-0001-0001-0001-000000000003', '38 - 15 + 22', 'abacus', '[38, -15, 22]', 'mixed', 45, 1, 2, 3, 2, TRUE, 10);

-- Questions for Bank 4: Advanced Calculations (G5-G8) - 3 digits
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('40000004-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000004', '125 + 234 - 89', 'abacus', '[125, 234, -89]', 'mixed', 270, 0, 3, 3, 3, TRUE, 1),
('40000004-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000004', '456 - 123 + 67', 'abacus', '[456, -123, 67]', 'mixed', 400, 1, 3, 3, 3, TRUE, 2),
('40000004-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000004', '312 + 188 - 100', 'abacus', '[312, 188, -100]', 'mixed', 400, 2, 3, 3, 3, TRUE, 3),
('40000004-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000004', '567 - 234 + 167', 'abacus', '[567, -234, 167]', 'mixed', 500, 0, 3, 3, 3, TRUE, 4),
('40000004-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000004', '789 + 111 - 400', 'abacus', '[789, 111, -400]', 'mixed', 500, 3, 3, 3, 3, TRUE, 5),
('40000004-0001-0001-0001-000000000006', '1b000001-0001-0001-0001-000000000004', '423 - 123 + 200', 'abacus', '[423, -123, 200]', 'mixed', 500, 1, 3, 3, 3, TRUE, 6),
('40000004-0001-0001-0001-000000000007', '1b000001-0001-0001-0001-000000000004', '654 + 246 - 300', 'abacus', '[654, 246, -300]', 'mixed', 600, 2, 3, 3, 3, TRUE, 7),
('40000004-0001-0001-0001-000000000008', '1b000001-0001-0001-0001-000000000004', '845 - 345 + 100', 'abacus', '[845, -345, 100]', 'mixed', 600, 0, 3, 3, 3, TRUE, 8),
('40000004-0001-0001-0001-000000000009', '1b000001-0001-0001-0001-000000000004', '912 + 88 - 400', 'abacus', '[912, 88, -400]', 'mixed', 600, 3, 3, 3, 3, TRUE, 9),
('40000004-0001-0001-0001-000000000010', '1b000001-0001-0001-0001-000000000004', '534 - 134 + 200', 'abacus', '[534, -134, 200]', 'mixed', 600, 1, 3, 3, 3, TRUE, 10);

-- Questions for Bank 5: Mock Test Foundation (G1-G2) - Simple addition
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('50000005-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000005', '1 + 2 + 3', 'abacus', '[1, 2, 3]', 'addition', 6, 0, 1, 3, 1, TRUE, 1),
('50000005-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000005', '2 + 3 + 2', 'abacus', '[2, 3, 2]', 'addition', 7, 1, 1, 3, 1, TRUE, 2),
('50000005-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000005', '4 + 1 + 2', 'abacus', '[4, 1, 2]', 'addition', 7, 2, 1, 3, 1, TRUE, 3),
('50000005-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000005', '3 + 2 + 1', 'abacus', '[3, 2, 1]', 'addition', 6, 0, 1, 3, 1, TRUE, 4),
('50000005-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000005', '5 + 2 + 1', 'abacus', '[5, 2, 1]', 'addition', 8, 3, 1, 3, 1, TRUE, 5);

-- Questions for Bank 6: Mock Test Small Friends (G3-G5) - 2 digit mixed
INSERT INTO public.questions (id, question_bank_id, question_text, type, operations, operator_type, correct_answer, correct_option_index, digits, rows_count, marks, is_auto_generated, sort_order) VALUES
('60000006-0001-0001-0001-000000000001', '1b000001-0001-0001-0001-000000000006', '18 + 7 - 5', 'abacus', '[18, 7, -5]', 'mixed', 20, 0, 2, 3, 1, TRUE, 1),
('60000006-0001-0001-0001-000000000002', '1b000001-0001-0001-0001-000000000006', '25 - 8 + 13', 'abacus', '[25, -8, 13]', 'mixed', 30, 1, 2, 3, 1, TRUE, 2),
('60000006-0001-0001-0001-000000000003', '1b000001-0001-0001-0001-000000000006', '32 + 14 - 16', 'abacus', '[32, 14, -16]', 'mixed', 30, 2, 2, 3, 1, TRUE, 3),
('60000006-0001-0001-0001-000000000004', '1b000001-0001-0001-0001-000000000006', '47 - 12 + 5', 'abacus', '[47, -12, 5]', 'mixed', 40, 0, 2, 3, 1, TRUE, 4),
('60000006-0001-0001-0001-000000000005', '1b000001-0001-0001-0001-000000000006', '53 + 17 - 20', 'abacus', '[53, 17, -20]', 'mixed', 50, 3, 2, 3, 1, TRUE, 5);

-- ============================================
-- 8. QUESTION OPTIONS (4 options per question)
-- ============================================

-- Options for Question 1 (Bank 1)
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('10000001-0001-0001-0001-000000000001', '9', 0),
('10000001-0001-0001-0001-000000000001', '8', 1),
('10000001-0001-0001-0001-000000000001', '10', 2),
('10000001-0001-0001-0001-000000000001', '7', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('10000001-0001-0001-0001-000000000002', '7', 0),
('10000001-0001-0001-0001-000000000002', '8', 1),
('10000001-0001-0001-0001-000000000002', '9', 2),
('10000001-0001-0001-0001-000000000002', '6', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('10000001-0001-0001-0001-000000000003', '8', 0),
('10000001-0001-0001-0001-000000000003', '10', 1),
('10000001-0001-0001-0001-000000000003', '9', 2),
('10000001-0001-0001-0001-000000000003', '7', 3);

-- Options for Bank 2 questions
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('20000002-0001-0001-0001-000000000001', '4', 0),
('20000002-0001-0001-0001-000000000001', '5', 1),
('20000002-0001-0001-0001-000000000001', '3', 2),
('20000002-0001-0001-0001-000000000001', '6', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('20000002-0001-0001-0001-000000000002', '3', 0),
('20000002-0001-0001-0001-000000000002', '2', 1),
('20000002-0001-0001-0001-000000000002', '4', 2),
('20000002-0001-0001-0001-000000000002', '1', 3);

-- Options for Bank 3 questions (mixed)
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('30000003-0001-0001-0001-000000000001', '26', 0),
('30000003-0001-0001-0001-000000000001', '28', 1),
('30000003-0001-0001-0001-000000000001', '24', 2),
('30000003-0001-0001-0001-000000000001', '30', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('30000003-0001-0001-0001-000000000002', '43', 0),
('30000003-0001-0001-0001-000000000002', '45', 1),
('30000003-0001-0001-0001-000000000002', '47', 2),
('30000003-0001-0001-0001-000000000002', '41', 3);

-- Options for Bank 4 questions (advanced)
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('40000004-0001-0001-0001-000000000001', '270', 0),
('40000004-0001-0001-0001-000000000001', '280', 1),
('40000004-0001-0001-0001-000000000001', '260', 2),
('40000004-0001-0001-0001-000000000001', '290', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('40000004-0001-0001-0001-000000000002', '390', 0),
('40000004-0001-0001-0001-000000000002', '400', 1),
('40000004-0001-0001-0001-000000000002', '410', 2),
('40000004-0001-0001-0001-000000000002', '380', 3);

-- Options for Mock Test Foundation (Bank 5)
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('50000005-0001-0001-0001-000000000001', '6', 0),
('50000005-0001-0001-0001-000000000001', '5', 1),
('50000005-0001-0001-0001-000000000001', '7', 2),
('50000005-0001-0001-0001-000000000001', '8', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('50000005-0001-0001-0001-000000000002', '6', 0),
('50000005-0001-0001-0001-000000000002', '7', 1),
('50000005-0001-0001-0001-000000000002', '8', 2),
('50000005-0001-0001-0001-000000000002', '5', 3);

-- Options for Mock Test Small Friends (Bank 6)
INSERT INTO public.question_options (question_id, text, option_index) VALUES
('60000006-0001-0001-0001-000000000001', '20', 0),
('60000006-0001-0001-0001-000000000001', '18', 1),
('60000006-0001-0001-0001-000000000001', '22', 2),
('60000006-0001-0001-0001-000000000001', '25', 3);

INSERT INTO public.question_options (question_id, text, option_index) VALUES
('60000006-0001-0001-0001-000000000002', '28', 0),
('60000006-0001-0001-0001-000000000002', '30', 1),
('60000006-0001-0001-0001-000000000002', '32', 2),
('60000006-0001-0001-0001-000000000002', '26', 3);

-- ============================================
-- 9. LINK QUESTION BANKS TO COMPETITIONS
-- ============================================

INSERT INTO public.competition_question_banks (competition_id, question_bank_id, grades) VALUES
('6924345a-6d0f-f275-e768-25e000000001', '1b000001-0001-0001-0001-000000000001', ARRAY[0,1,2]),
('6924345a-6d0f-f275-e768-25e000000001', '1b000001-0001-0001-0001-000000000002', ARRAY[1,2,3]),
('6924345a-6d0f-f275-e768-25e000000001', '1b000001-0001-0001-0001-000000000003', ARRAY[3,4,5]),
('6924345a-6d0f-f275-e768-25e000000001', '1b000001-0001-0001-0001-000000000004', ARRAY[5,6,7,8]);

-- ============================================
-- 10. LINK QUESTION BANKS TO MOCK TESTS
-- ============================================

-- NOTE: Mock tests should have their question banks assigned manually via the Admin Panel
-- to ensure proper grade matching and question count alignment.
-- The assignment below has been removed to prevent data mismatches where:
-- 1. Question bank grade ranges don't match mock test grade ranges
-- 2. Question bank doesn't have enough questions for the mock test's total_questions
--
-- Example: Foundation mock test expects 25 questions but linked bank only had 5
--
-- To assign question banks manually:
-- 1. Go to Admin Panel > Mock Tests
-- 2. Select a mock test
-- 3. Click "Assign Question Banks"
-- 4. Select appropriate banks that match the grade range and have sufficient questions

-- INSERT INTO public.mock_test_question_banks (mock_test_id, question_bank_id, grades) VALUES
-- ('692484a4-767b-2be2-c4c2-aad600000001', '1b000001-0001-0001-0001-000000000005', ARRAY[0,1,2]),
-- ('692484a4-767b-2be2-c4c2-aad700000002', '1b000001-0001-0001-0001-000000000006', ARRAY[3,4,5]),
-- ('692484a4-767b-2be2-c4c2-aad800000003', '1b000001-0001-0001-0001-000000000003', ARRAY[3,4,5]),
-- ('692484a4-767b-2be2-c4c2-aad900000004', '1b000001-0001-0001-0001-000000000004', ARRAY[5,6,7,8]);

-- ============================================
-- VERIFICATION QUERIES (Optional - Run Manually)
-- ============================================

-- Check competitions
-- SELECT id, title, slug, status, enrollment_fee, min_grade, max_grade FROM competitions;

-- Check syllabus
-- SELECT c.title, cs.topic, cs.sort_order 
-- FROM competition_syllabus cs 
-- JOIN competitions c ON c.id = cs.competition_id
-- ORDER BY cs.sort_order;

-- Check prizes
-- SELECT c.title, cp.rank, cp.title as prize_title, cp.worth, cp.prize_type
-- FROM competition_prizes cp 
-- JOIN competitions c ON c.id = cp.competition_id
-- ORDER BY cp.rank;

-- Check mock tests
-- SELECT title, difficulty, duration, total_questions, min_grade, max_grade, tags
-- FROM mock_tests ORDER BY sort_order;

-- Check question banks
-- SELECT id, title, bank_type, min_grade, max_grade, total_marks FROM question_banks;

-- Check questions per bank
-- SELECT qb.title, COUNT(q.id) as question_count FROM question_banks qb
-- LEFT JOIN questions q ON q.question_bank_id = qb.id
-- GROUP BY qb.id, qb.title;
