-- ============================================
-- Migration: Add Abacus Question Support
-- For Wisdom Abacus Platform - Question Bank Redesign
-- ============================================

-- Add bank_type to question_banks to differentiate between competition and mock_test banks
ALTER TABLE public.question_banks 
ADD COLUMN IF NOT EXISTS bank_type TEXT DEFAULT 'competition' CHECK (bank_type IN ('competition', 'mock_test'));

-- Add status for draft support
ALTER TABLE public.question_banks 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

-- ============================================
-- Restructure QUESTIONS table for Abacus-style questions
-- Questions are MCQs where the "question" is a list of operations
-- ============================================

-- Add new columns to questions table for abacus operations
-- operations is a JSONB array: e.g., [5, 3, -2, 7] means 5 + 3 - 2 + 7
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS operations JSONB DEFAULT '[]';

-- operator_type indicates the primary operation type for display
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS operator_type TEXT DEFAULT 'addition' CHECK (operator_type IN ('addition', 'subtraction', 'multiplication', 'division', 'mixed'));

-- correct_answer stores the computed correct answer
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS correct_answer INTEGER;

-- digits indicates how many digits the numbers have (1, 2, 3, etc.)
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS digits INTEGER DEFAULT 1;

-- rows indicates how many numbers in the operation (for addition/subtraction)
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS rows_count INTEGER DEFAULT 3;

-- is_auto_generated flag to distinguish between auto-generated and manually added questions
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS is_auto_generated BOOLEAN DEFAULT TRUE;

-- Update min_grade and max_grade constraints for UKG to Grade 8
-- UKG = 0, Grade 1 = 1, ..., Grade 8 = 8
ALTER TABLE public.question_banks 
DROP CONSTRAINT IF EXISTS question_banks_min_grade_check;

ALTER TABLE public.question_banks 
DROP CONSTRAINT IF EXISTS question_banks_max_grade_check;

ALTER TABLE public.question_banks 
ADD CONSTRAINT question_banks_min_grade_check CHECK (min_grade >= 0 AND min_grade <= 8);

ALTER TABLE public.question_banks 
ADD CONSTRAINT question_banks_max_grade_check CHECK (max_grade >= 0 AND max_grade <= 8);

-- ============================================
-- Create index for new columns
-- ============================================
CREATE INDEX IF NOT EXISTS idx_question_banks_bank_type ON public.question_banks(bank_type);
CREATE INDEX IF NOT EXISTS idx_question_banks_status ON public.question_banks(status);
CREATE INDEX IF NOT EXISTS idx_questions_operator_type ON public.questions(operator_type);

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON COLUMN public.question_banks.bank_type IS 'Type of content this bank is for: competition or mock_test';
COMMENT ON COLUMN public.question_banks.status IS 'Bank status: draft, published, or archived';
COMMENT ON COLUMN public.questions.operations IS 'JSON array of numbers for the question, e.g., [5, 3, -2] means 5 + 3 - 2';
COMMENT ON COLUMN public.questions.operator_type IS 'Primary operation type: addition, subtraction, multiplication, division, or mixed';
COMMENT ON COLUMN public.questions.correct_answer IS 'The correct answer to the question';
COMMENT ON COLUMN public.questions.digits IS 'Number of digits in each operand (1-5)';
COMMENT ON COLUMN public.questions.rows_count IS 'Number of operands/rows in the question (for addition/subtraction)';
COMMENT ON COLUMN public.questions.is_auto_generated IS 'Whether this question was auto-generated or manually created';
