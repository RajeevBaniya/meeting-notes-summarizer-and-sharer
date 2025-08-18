# Meeting Notes Backend

Simple Express server for the AI meeting notes summarizer app.

## Setup

1. Install dependencies:
```
npm install
```

2. Set up Supabase tables:
   - Follow instructions in `supabase/README.md`
   - Run the SQL in `supabase/migrations.sql` in your Supabase SQL Editor

3. Create a `.env` file with:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password_here

# Supabase settings
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Cors settings
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

4. Start the server:
```
npm start
```

## API Endpoints

- `POST /api/upload` - Upload text transcript
- `POST /api/summary/generate` - Generate AI summary
- `GET /api/summaries` - Get list of summaries
- `GET /api/summaries/:id` - Get a specific summary
- `PUT /api/summaries/:id` - Update a summary
- `DELETE /api/summaries/:id` - Delete a summary
- `POST /api/email` - Send summary via email

## Deployment

When deploying to Render or other platforms, make sure to:
1. Set all environment variables
2. Run the Supabase migrations
3. Use the correct Supabase service role key (not the anon key)

## Notes

- Email sending requires Gmail app password
- Only .txt files are supported for upload
- Max file size: 5MB
- Authentication is handled through Supabase Auth
