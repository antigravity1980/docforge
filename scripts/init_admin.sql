-- 1. Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow public read access (for pricing, maintenance mode, etc.)
CREATE POLICY "Allow public read access" ON public.settings FOR SELECT USING (true);

-- Allow only authenticated users to read (optional stricter policy)
-- CREATE POLICY "Allow authenticated read access" ON public.settings FOR SELECT TO authenticated USING (true);

-- Allow Service Role ONLY to insert/update/delete
-- Since the API uses supabaseAdmin (service role), we don't strictly need a policy here for writes
-- unless we want to allow row-level writes from client (not recommended).

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- 5. Insert Default Settings (if not exist)
INSERT INTO public.settings (key, value) VALUES
    ('siteName', '"DocForge AI"'),
    ('supportEmail', '"support@docforge.ai"'),
    ('maintenanceMode', 'false'),
    ('aiModel', '"llama-3.3-70b-versatile"'),
    ('maxFreeDocs', '3'),
    ('priceStarter', '29'),
    ('pricePro', '79')
ON CONFLICT (key) DO NOTHING;
