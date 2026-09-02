# Schedula — Complete Day 1–4 Healthcare Portal

A responsive Next.js healthcare web application covering the combined requirements from:
- Day 1: user login, doctor listing and booking flow
- Day 2: doctor registration/login/dashboard/profile/availability and user slot integration
- Day 3: appointment management, status actions, calendar/rescheduling, notifications and completed appointment actions
- Day 4: doctor prescription management, user appointment dashboard and comprehensive user profile

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Persistence

This project uses browser `localStorage` as a lightweight client-side database. Data entered through the forms persists across refreshes on the same browser/device and demonstrates the Doctor → User prescription and appointment data flow without requiring external database credentials.

## Suggested Day 4 branch

```bash
git checkout -b feat/day-4-prescription-management
```
