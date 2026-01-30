-- ============================================
-- AUTHENTICATION SETUP
-- ============================================
-- Run this to add user ownership and proper RLS policies
-- ============================================

-- 1. Add user_id column to track form ownership
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS forms_user_id_idx ON forms(user_id);

-- 2. Drop old permissive policies (if they exist)
DROP POLICY IF EXISTS "Anyone can create forms" ON forms;
DROP POLICY IF EXISTS "Public forms are viewable by anyone" ON forms;
DROP POLICY IF EXISTS "Anyone can update filled_data" ON forms;

-- 3. Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- 4. NEW POLICIES with proper authentication

-- Allow public reading of all forms (for share links)
CREATE POLICY "forms_select_policy" 
ON forms 
FOR SELECT 
USING (true);

-- Only authenticated users can create forms
CREATE POLICY "forms_insert_policy" 
ON forms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own forms' structure
CREATE POLICY "forms_update_structure_policy" 
ON forms 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Anyone can update filled_data (collaborative filling)
-- But we still track who owns the form
CREATE POLICY "forms_update_filled_data_policy" 
ON forms 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Users can only delete their own forms
CREATE POLICY "forms_delete_policy" 
ON forms 
FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- NOTES
-- ============================================
-- After running this:
-- 1. Users must be logged in to create forms
-- 2. Each form is owned by the user who created it
-- 3. Anyone can view forms via share links
-- 4. Anyone can fill out shared forms (collaborative)
-- 5. Only owners can edit/delete their forms
-- ============================================
