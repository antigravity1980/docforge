# 🔥 CRITICAL SITE CONFIGURATION

**DO NOT DEPLOY WITHOUT THESE SETTINGS!**

The site is now database-driven and requires specific environment variables and database tables to function. Missing any of these will cause a **Server-Side Exception (500 Error)**.

## 1. Environment Variables (Required)

You must add these to your [Vercel Project Settings](https://vercel.com/docs/projects/environment-variables) and your local `.env.local` file.

| Variable Name | Value Description | Required For |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Database Connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon/Public Key | Client-side Auth & Public Data |
| `SUPABASE_SERVICE_ROLE_KEY` | **YOUR SECRET SERVICE KEY** (Starts with `ey...`) | **Admin Panel & Pricing API (CRITICAL)** |
| `NEXT_PUBLIC_APP_URL` | `https://docforge.site` (Production) or `http://localhost:3000` (Local) | OAuth Redirects & SEO |

> ⚠️ **IMPORTANT:** The `SUPABASE_SERVICE_ROLE_KEY` is absolutely required for the new dynamic pricing to work. Without it, the homepage cannot fetch prices and will crash.

## 2. Database Schema (Required)

Run this SQL in your Supabase SQL Editor to create the necessary table:

```sql
-- Create settings table for dynamic pricing
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow service role (API) full access
CREATE POLICY "Allow service role full access" ON public.settings
    FOR ALL USING (true) WITH CHECK (true);

-- Insert default prices if missing
INSERT INTO public.settings (key, value)
VALUES 
    ('priceStarter', '"29"'),
    ('pricePro', '"79"')
ON CONFLICT (key) DO NOTHING;
```

## 3. Deployment Checklist

Before every deploy, verify:

1.  **Build Check:** Run `npm run build` locally. It MUST pass.
2.  **Lint Check:** Run `npm run lint` locally. It MUST pass.
3.  **Env Check:** Ensure Vercel has `SUPABASE_SERVICE_ROLE_KEY`.

---
*Created by Antigravity Agent to prevent future site breakages.*
