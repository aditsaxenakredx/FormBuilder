-- Add background_color column to forms table
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#d1eff1';

-- Update existing rows to have the default color
UPDATE forms 
SET background_color = '#d1eff1' 
WHERE background_color IS NULL;
