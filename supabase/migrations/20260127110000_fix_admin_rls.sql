-- ============================================
-- Migration: Fix Admin RLS
-- Description: Allow admin users to read their own profile during login
-- ============================================

-- Allow users to verify their admin status
-- This is required for auth.service.ts to check if the logged-in user is an admin
CREATE POLICY "Admins can read their own admin profile"
ON public.admin_users
FOR SELECT
USING (auth.uid() = id);
