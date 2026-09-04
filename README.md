# Schedula Final Week

A responsive healthcare appointment platform covering Days 1–6: user and doctor portals, booking, availability, appointment management, calendar, prescriptions, PDF downloads, notifications, AI care assistant, persistent local datastore and a unique care-plan feature.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:3000.

## Demo credentials
- User: `patient@schedula.demo` / `demo123`
- Doctor: `doctor@schedula.demo` / `demo123`

## AI
Add `GROQ_API_KEY` to `.env` to enable Groq. Without a key, the assistant uses a safe local demo response so the UI still works.

## Persistence
The app persists demo data in browser localStorage and synchronizes a server-side embedded JSON datastore through `/api/data` for local development. This avoids requiring an external database service for internship demos.
