-- ============================================
-- Migration: Remove Phone Unique Constraint
-- Description: Allow multiple students (siblings) to share the same parent phone number
--              Each student is uniquely identified by their email, not phone
-- Created: 2026-02-03
-- ============================================

-- Remove the unique constraint on phone in profiles table
-- This allows siblings to share the same parent phone number
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_key;

-- Also drop the unique index if it exists
DROP INDEX IF EXISTS profiles_phone_key;
DROP INDEX IF EXISTS idx_profiles_phone_unique;

-- Re-add a non-unique index for phone lookups (for performance)
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- Add a comment explaining the design decision
COMMENT ON COLUMN public.profiles.phone IS 'Parent phone number - NOT unique since siblings can share the same parent phone. Each student is uniquely identified by email.';
