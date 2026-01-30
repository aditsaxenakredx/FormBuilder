-- ============================================
-- CRITICAL SECURITY: Row Level Security (RLS)
-- ============================================
-- Run these SQL commands in your Supabase SQL Editor
-- to enable Row Level Security on the forms table
-- ============================================

-- 1. Enable RLS on forms table
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to read published forms (public access)
CREATE POLICY "Public forms are viewable by anyone" 
ON forms 
FOR SELECT 
USING (true);

-- 3. Allow anyone to update filled_data (collaborative filling)
-- This allows form viewers to save their responses
CREATE POLICY "Anyone can update filled_data" 
ON forms 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 4. Only authenticated users can create forms
-- IMPORTANT: Currently your app has no authentication
-- This will BLOCK form creation until you implement auth
-- If you want to test without auth, comment out this policy
CREATE POLICY "Authenticated users can create forms" 
ON forms 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 5. Only form owners can delete forms
-- IMPORTANT: Requires user_id column (not yet implemented)
-- CREATE POLICY "Users can delete own forms" 
-- ON forms 
-- FOR DELETE 
-- USING (auth.uid() = user_id);

-- ============================================
-- DATABASE SCHEMA UPDATE
-- ============================================
-- Add filled_data column if it doesn't exist
-- ============================================

ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS filled_data JSONB DEFAULT '{}'::jsonb;

-- ============================================
-- OPTIONAL: Add user_id for future authentication
-- ============================================
-- Uncomment when you implement Supabase Auth
-- ============================================

-- ALTER TABLE forms 
-- ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- CREATE INDEX IF NOT EXISTS forms_user_id_idx ON forms(user_id);

-- ============================================
-- SECURITY NOTES
-- ============================================
-- 1. The current setup allows ANYONE to:
--    - View all forms
--    - Create new forms (if you comment out authenticated policy)
--    - Update filled_data on any form
--
-- 2. To fully secure, you MUST implement authentication:
--    - Add Supabase Auth to your app
--    - Add user_id column to forms table
--    - Update policies to check user ownership
--
-- 3. Rate limiting should be configured in Supabase Dashboard:
--    Settings > API > Rate Limiting
--
-- 4. Monitor usage in Supabase Dashboard:
--    Database > Logs
-- ============================================
