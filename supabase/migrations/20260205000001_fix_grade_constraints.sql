-- ============================================
-- Migration: Fix remaining grade constraints and NULL handling
-- Description: Ensures student_grade can be NULL (not set yet) or 0-12
--              Also fixes demo_requests constraint not addressed in previous migration
-- Created: 2026-02-05
-- ============================================

-- ============================================
-- FIX PROFILES TABLE CONSTRAINT (Allow NULL)
-- The previous migration (20260204000002) only allowed 0-12
-- but we need to allow NULL as well for incomplete profiles
-- ============================================

-- Drop the existing constraint
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_student_grade_check;

-- Re-create with NULL handling (NULL OR 0-12)
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_student_grade_check 
  CHECK (student_grade IS NULL OR student_grade BETWEEN 0 AND 12);

-- ============================================
-- FIX DEMO REQUESTS TABLE (not addressed in previous migration)
-- ============================================

-- Drop existing constraint
ALTER TABLE public.demo_requests 
  DROP CONSTRAINT IF EXISTS demo_requests_grade_check;

-- Re-create with corrected range
ALTER TABLE public.demo_requests 
  ADD CONSTRAINT demo_requests_grade_check 
  CHECK (grade BETWEEN 0 AND 12);

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Grade constraint NULL handling migration completed successfully';
END $$;
