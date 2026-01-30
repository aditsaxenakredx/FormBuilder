-- ============================================
-- QUICK FIX: Add filled_data column (no RLS yet)
-- ============================================
-- Run this FIRST if you're getting "column does not exist" errors
-- This allows the app to work immediately
-- Then run the full supabase_security_setup.sql for security
-- ============================================

-- Add filled_data column if it doesn't exist
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS filled_data JSONB DEFAULT '{}'::jsonb;

-- That's it! Your app should work now.
-- But PLEASE run supabase_security_setup.sql next for security!
