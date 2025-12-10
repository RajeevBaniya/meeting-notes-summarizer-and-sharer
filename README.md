# AI-Powered Meeting Notes Summarizer and Sharer

link - https://meeting-notes-summarizer-app.vercel.app/

A simple app that helps summarize meeting transcripts using AI and share them via email.

## How it works

1. Upload a text transcript of your meeting
2. Add custom instructions for the AI
3. Generate a summary
4. Edit the summary if needed
5. Share via email with team members

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

## Notes

- Only .txt files supported for now  
- In future pdf and  audio upload transcription option will be there

