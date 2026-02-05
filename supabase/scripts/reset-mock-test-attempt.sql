-- Script to reset a user's mock test attempt so they can retake it with the new question bank
-- Run this in Supabase SQL Editor

-- Step 1: Find the user ID (replace with actual email)
-- SELECT id, email FROM auth.users WHERE email = 'your-test-user-email@example.com';

-- Step 2: Find the mock test ID
-- SELECT id, title FROM mock_tests WHERE title ILIKE '%Foundation%';

-- Step 3: Execute the cleanup (REPLACE the values below with actual IDs)
-- =============================================================================

-- Variables (REPLACE THESE)
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with actual user ID
  test_mock_test_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with mock test ID
BEGIN
  -- Delete exam sessions for this user and mock test
  DELETE FROM exam_sessions 
  WHERE user_id = test_user_id 
    AND exam_type = 'mock-test' 
    AND exam_id = test_mock_test_id::text;
  
  RAISE NOTICE 'Deleted exam sessions';

  -- Delete submission answers linked to the submission
  DELETE FROM submission_answers 
  WHERE submission_id IN (
    SELECT id FROM submissions 
    WHERE user_id = test_user_id 
      AND mock_test_id = test_mock_test_id
  );
  
  RAISE NOTICE 'Deleted submission answers';

  -- Delete the submission itself
  DELETE FROM submissions 
  WHERE user_id = test_user_id 
    AND mock_test_id = test_mock_test_id;
  
  RAISE NOTICE 'Deleted submissions';

  -- Delete the mock test attempt record
  DELETE FROM user_mock_test_attempts 
  WHERE user_id = test_user_id 
    AND mock_test_id = test_mock_test_id;
  
  RAISE NOTICE 'Deleted mock test attempts';

  RAISE NOTICE 'Cleanup complete! User can now retake the mock test.';
END $$;

-- =============================================================================
-- Alternative: Simple queries to check what exists for a user
-- =============================================================================

-- Check existing submissions
-- SELECT s.id, s.exam_type, s.status, s.exam_snapshot, s.created_at
-- FROM submissions s
-- WHERE s.user_id = '...' AND s.mock_test_id = '...';

-- Check existing attempts
-- SELECT * FROM user_mock_test_attempts WHERE user_id = '...' AND mock_test_id = '...';

-- Check existing sessions
-- SELECT * FROM exam_sessions WHERE user_id = '...' AND exam_type = 'mock-test';
