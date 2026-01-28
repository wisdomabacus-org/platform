-- ============================================
-- Migration: Add type column to questions
-- Description: Adds a broad 'type' column to categorize questions (e.g., 'abacus', 'text').
-- ============================================

ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'abacus' CHECK (type IN ('abacus', 'text', 'image'));

COMMENT ON COLUMN public.questions.type IS 'Broad category of the question: abacus (operations), text (standard MCQ), or image.';

CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(type);
