-- ============================================
-- Migration: Fix RLS for Admin Panel
-- Description: Allow authenticated users full access to question bank tables
-- ============================================

-- QUESTION BANKS
DROP POLICY IF EXISTS "Service role has full access to question_banks" ON public.question_banks;

CREATE POLICY "Authenticated users have full access to question_banks"
  ON public.question_banks FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- QUESTIONS
DROP POLICY IF EXISTS "Service role has full access to questions" ON public.questions;

CREATE POLICY "Authenticated users have full access to questions"
  ON public.questions FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- QUESTION OPTIONS
DROP POLICY IF EXISTS "Service role has full access to question_options" ON public.question_options;

CREATE POLICY "Authenticated users have full access to question_options"
  ON public.question_options FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
