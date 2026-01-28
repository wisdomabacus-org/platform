-- ============================================
-- Migration: Update Profiles Schema
-- Description: Allow grade 0 (UKG), add status and role columns
-- ============================================

-- 1. Update student_grade constraint to allow 0
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_student_grade_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_student_grade_check CHECK (student_grade BETWEEN 0 AND 12);

-- 2. Add status column for suspension logic
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended'));

-- 3. Add role column to distinguish explicit admins if they exist in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 4. Update existing profiles to have defaults if null (though defaults handle new inserts)
UPDATE public.profiles SET status = 'active' WHERE status IS NULL;
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- 5. Index for status and role filtering
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 6. Modify payments table to preserve records on user deletion (Set User ID to NULL)
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE public.payments ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

