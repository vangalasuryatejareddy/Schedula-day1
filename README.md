# Schedula — Day 1 to Day 5 Complete

A complete healthcare scheduling application covering:

- User login, doctor listing and appointment booking
- Doctor registration/login, profile and availability management
- Appointment dashboard, status workflow, filters and calendar views
- User appointment dashboard, prescription viewing/PDF download, review and rebook
- Doctor prescription management
- User health profile
- Notifications
- Responsive mobile navigation
- Schedula AI Care Assistant with optional Groq integration and healthcare safety guardrails
- SQLite database persistence through Prisma

## Run

```bash
npm install
npm run prepare-db
npm run dev
```

Open `http://localhost:3000`

Optional AI:
1. Copy `.env.example` to `.env`
2. Add `GROQ_API_KEY`
3. Restart the server

Without a Groq key the app still works with a safe built-in fallback assistant.
