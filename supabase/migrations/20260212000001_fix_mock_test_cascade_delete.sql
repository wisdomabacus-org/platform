-- ============================================
-- Migration: Fix Mock Test Cascade Delete
-- Description: Allow mock tests to be deleted by cascading deletion to submissions
-- ============================================

DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Find the foreign key constraint on submissions table that references mock_tests
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.submissions'::regclass
  AND confrelid = 'public.mock_tests'::regclass
  LIMIT 1;

  -- If found, drop it
  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.submissions DROP CONSTRAINT ' || quote_ident(constraint_name);
  END IF;
END $$;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE public.submissions
ADD CONSTRAINT submissions_mock_test_id_fkey
FOREIGN KEY (mock_test_id)
REFERENCES public.mock_tests(id)
ON DELETE CASCADE;
