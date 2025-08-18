# Supabase Migration

This directory contains SQL migration scripts to set up the required tables and policies in Supabase.

## Steps to Set Up Supabase

1. Log in to your Supabase dashboard
2. Select your project
3. Go to the SQL Editor
4. Copy the contents of `migrations.sql`
5. Run the SQL in the Supabase SQL Editor

## Required Tables

This will set up the following tables:

1. `public.summaries` - Stores all meeting summaries
2. `public.profiles` - (Optional) Stores additional user profile information

## Environment Variables

Make sure to set the following environment variables in your backend:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

You can find these values in your Supabase project settings under API:
- Project URL
- Service Role Key (this is different from the anon/public key)
