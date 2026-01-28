
CREATE TABLE IF NOT EXISTS public.referrers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Assuming basic authenticated access for admins)
ALTER TABLE public.referrers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users (admins)" ON public.referrers
    FOR ALL USING (auth.role() = 'authenticated');
