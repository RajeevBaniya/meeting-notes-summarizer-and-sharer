# SummerEase - Meeting Notes Summarizer

link - https://meeting-notes-summarizer-app.vercel.app/

Summarize meeting transcripts using AI and share them via email.

## How it works
1. Upload your meeting transcript (.txt, .pdf, or .docx)
2. Fill in meeting details (title, date, participants)
3. Add custom instructions for the AI
4. Generate a summary with extracted action items and decisions
5. Edit the summary if needed
6. Share via email with team members

## Setup

### Backend
```
cd backend
npm install
```
Create `.env` file with your Groq API key and Gmail credentials
```
npm start
```

### Frontend
```
cd frontend
npm install
npm run dev
```

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq API
- Email: Nodemailer with Gmail

## Supported File Formats

- `.txt` - Plain text files
- `.pdf` - PDF documents
- `.docx` - Microsoft Word documents

## Notes

- Maximum file size: 10MB
- Audio/video transcription coming soon

