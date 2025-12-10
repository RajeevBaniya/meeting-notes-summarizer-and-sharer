# Meeting Notes Backend

Express server for the AI meeting notes summarizer app.

## Setup

1. Install dependencies:
```
npm install
```

2. Set up Supabase tables:
   - Follow instructions in `supabase/README.md`
   - Run `supabase/migrations.sql` in your Supabase SQL Editor
   - Run `supabase/migrations_v2.sql` to add meeting metadata fields

3. Create a `.env` file with:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password_here

# Supabase settings
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

4. Start the server:
```
npm start
```
