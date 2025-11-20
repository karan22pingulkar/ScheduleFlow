# ScheduleFlow 🚀
Social Cross-Posting POC — Django REST + React (Vite) with Celery & Redis

A full-stack proof-of-concept showcasing modern auth, background scheduling, and clean API integrations. The backend uses Django REST Framework with JWT authentication, modular apps, and Celery + Redis for reliable background jobs (post scheduling, analytics fetching). The frontend is a React (Vite) app with protected routes, AuthContext, and a responsive Tailwind UI.

Key capabilities include user-linked social accounts, post creation, scheduled posting orchestrated by Celery Beat (scheduler) and executed by a Celery Worker, with Redis as the message broker. Each scheduled run is recorded in Post Logs for observability. The system is designed for a free-tier friendly deployment stack (Vercel + Render/Railway + Neon + Cloudinary + Upstash/Render Redis).

Highlights

🔐 JWT Auth Flow: Register, login, refresh; protected APIs & routes.

🧩 React + Tailwind: Clean UI, protected pages, API error handling.

🔗 Social Accounts: Connect & manage platform credentials.

📝 Posts CRUD: Create/update/delete posts; image upload ready.

⏰ Scheduling Engine: Celery Beat schedules, Celery Worker runs jobs, Redis brokers tasks.

🚀 Deployment-Ready: Vercel (frontend) • Render/Railway (API & workers) • Neon (DB) • Cloudinary (media) • Upstash/Render (Redis).
