# Meeting Notes Backend

Simple Express server for the AI meeting notes summarizer app.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password_here
```

3. Start the server:
```
npm start
```

## API Endpoints

- `POST /api/upload` - Upload text transcript
- `POST /api/summary` - Generate AI summary
- `POST /api/email` - Send summary via email

## Notes

- Email sending requires Gmail app password
- Only .txt files are supported for upload
- Max file size: 5MB
