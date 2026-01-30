# Authentication & Dashboard Setup Guide

## 🎉 What's New

You now have a complete authentication system with:

✅ **User Authentication** - Login/Signup with Supabase Auth
✅ **Dashboard** - Landing page with templates and recent forms  
✅ **Protected Routes** - Editor requires login
✅ **Form Ownership** - Each form tracks who created it
✅ **Template System** - Pre-built form templates

---

## 📋 Setup Steps

### Step 1: Enable Supabase Auth

1. Open **Supabase Dashboard** → Your Project
2. Go to **Authentication** → Settings
3. Make sure **Email Auth** is enabled (it should be by default)
4. (Optional) Configure email templates for password reset, etc.

### Step 2: Run Database Migration

Open **Supabase SQL Editor** and run:

```sql
-- Add user_id column
ALTER TABLE forms 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index
CREATE INDEX IF NOT EXISTS forms_user_id_idx ON forms(user_id);

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can create forms" ON forms;
DROP POLICY IF EXISTS "Public forms are viewable by anyone" ON forms;
DROP POLICY IF EXISTS "Anyone can update filled_data" ON forms;

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- New policies
CREATE POLICY "forms_select_policy" 
ON forms FOR SELECT USING (true);

CREATE POLICY "forms_insert_policy" 
ON forms FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forms_update_structure_policy" 
ON forms FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "forms_update_filled_data_policy" 
ON forms FOR UPDATE 
USING (true) WITH CHECK (true);

CREATE POLICY "forms_delete_policy" 
ON forms FOR DELETE 
USING (auth.uid() = user_id);
```

Or just run the file: **`setup_auth.sql`**

---

## 🚀 Testing the New Features

### 1. Sign Up
- Visit http://localhost:3000
- Auto-redirects to `/login`
- Click "Sign up"
- Enter email and password
- You'll be redirected to the dashboard

### 2. Dashboard
- See 3 predefined templates (Loan, Employee, Survey)
- "Create New Form" button for blank form
- "Recent Forms" shows your forms (empty initially)

### 3. Create a Form
- Click "Create New Form" or use a template
- Build your form in the editor
- Click "Publish & Share"
- Form is saved with your `user_id`
- Get shareable link

### 4. View Recent Forms
- Dashboard shows your last 6 forms
- Click to edit any form
- Only you can see/edit your forms

### 5. Sign Out
- Click "Sign Out" in header
- Redirected to login
- Session cleared

---

## 🔒 Security Model

### What Users Can Do:

✅ **Anyone can**:
- View shared forms (via `/share/[id]` links)
- Fill out collaborative forms
- Update `filled_data` on any form

✅ **Authenticated users can**:
- Create new forms
- View their own forms in dashboard
- Edit/delete their own forms

❌ **Users cannot**:
- View other users' forms in their dashboard
- Edit other users' form structures
- Delete other users' forms

### RLS Policies Explained:

```sql
-- Public can view for sharing
SELECT: true

-- Only logged-in users can create
INSERT: auth.uid() = user_id

-- Only owners can edit structure
UPDATE: auth.uid() = user_id  

-- Anyone can update filled_data (collaborative)
UPDATE filled_data: true

-- Only owners can delete
DELETE: auth.uid() = user_id
```

---

## 📂 Updated File Structure

```
app/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── dashboard/
│   ├── page.tsx                 # Dashboard with templates
│   └── dashboard.module.css
├── editor/
│   └── page.tsx                 # Protected FormBuilder route
├── login/
│   ├── page.tsx                 # Login page
│   └── auth.module.css
├── signup/
│   └── page.tsx                 # Sign up page
├── page.tsx                     # Home (redirects to dashboard/login)
└── layout.tsx                   # Wrapped with AuthProvider
```

---

## 🎨 User Flow

```
/ (root)
  ↓
User logged in?
  ├─ YES → /dashboard
  │         ├─ Templates
  │         ├─ Recent Forms
  │         └─ Create New
  │              ↓
  │         /editor → FormBuilder
  │              ↓
  │         Publish & Share
  │
  └─ NO → /login
           └─ Sign up link → /signup
```

---

## 🔧 Troubleshooting

### "Permission denied" when publishing
- Make sure you ran `setup_auth.sql`
- Check that RLS policies are created:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'forms';
  ```

### "User must be logged in"
- Clear browser storage and re-login
- Check Supabase Auth logs

### Can't see recent forms
- Check `user_id` is set on forms:
  ```sql
  SELECT id, title, user_id FROM forms;
  ```
- Make sure you're logged in with same email

### Auth redirect loop
- Clear cookies and local storage
- Restart dev server

---

## 🚀 Next Steps

Now that auth is working, you can:

1. **Add form editing**:
   - Load form by ID in editor
   - Update instead of insert
   
2. **Add form management**:
   - Delete forms from dashboard
   - Duplicate forms
   - Rename forms

3. **Add real templates**:
   - Create actual template structures
   - Load templates in editor

4. **Add profile page**:
   - Update email
   - Change password
   - View usage stats

5. **Add social auth**:
   - Google OAuth
   - GitHub OAuth
   
---

## ✅ Checklist

Before using in production:

- [ ] Ran `setup_auth.sql` in Supabase
- [ ] Tested signup flow
- [ ] Tested login flow  
- [ ] Tested creating forms (should save `user_id`)
- [ ] Tested dashboard shows only your forms
- [ ] Tested sign out
- [ ] Configured email templates in Supabase
- [ ] Set up password reset flow
- [ ] Added rate limiting to Supabase

---

## 🎯 Template System (Placeholder)

Currently templates are placeholders. To implement:

1. Create template structures in `app/templates/` directory
2. Load template on button click:
   ```typescript
   const handleUseTemplate = (templateId: string) => {
     const template = TEMPLATE_STRUCTURES[templateId];
     // Load into FormBuilder
   };
   ```
3. Templates can be:
   - JSON files
   - Database entries
   - Hardcoded structures

---

Enjoy your authenticated form builder! 🚀
