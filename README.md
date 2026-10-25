# ScheduleFlow 🚀
Social Cross-Posting POC — Django REST + React (Vite), deployed 100% free.

A full-stack proof-of-concept showcasing JWT auth, scheduled cross-posting, and a polished dark UI. Write a post once, pick your platforms and a time — a lightweight in-process scheduler publishes it and logs the result. No message broker, no paid services.

## Highlights

- 🔐 **JWT Auth Flow** — register, login, refresh; protected APIs & routes.
- 🎨 **Animated UI** — React 19 + Tailwind + Framer Motion: glassmorphism cards, aurora background with floating social icons.
- 🔗 **Social Accounts** — connect & manage platform credentials (IG / LinkedIn / X / FB).
- 📝 **Posts CRUD** — create/edit/delete posts with Cloudinary image uploads.
- ⏰ **Scheduling** — in-process scheduler thread polls every 30s, atomically claims due posts, flips `pending → success` and writes a **PostLog** entry (replaces the old Celery + Redis pipeline — same behavior, zero broker).
- 📜 **Post Logs** — every scheduled run is recorded and visible in the app's logs drawer.

## Stack

| Layer | Tech | Hosting (free tier) |
|---|---|---|
| Frontend | React 19, Vite, Tailwind, Framer Motion | **Vercel** |
| API | Django 5, DRF, SimpleJWT, Gunicorn | **Render** web service |
| Scheduler | In-process daemon thread (`posts/scheduler.py`) | runs inside the web service |
| Database | PostgreSQL | **Neon** serverless |
| Media | Image uploads | **Cloudinary** |
| Keep-alive | `GET /health/` every 5 min | **UptimeRobot** |

## Local dev

```bash
# backend/.env
SECRET_KEY=...
DATABASE_URL=postgres://...        # Neon
ALLOWED_HOSTS=127.0.0.1,localhost
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
USE_REDIS_CACHE=false              # locmem cache, no Redis needed
ENABLE_INLINE_SCHEDULER=true       # starts the publisher thread

cd backend && env/Scripts/python manage.py runserver

# frontend/.env
VITE_API_BASE_URL=http://127.0.0.1:8000/api

cd frontend && npm run dev
```

## Deploy notes

- **Render env vars**: same as above (set `USE_REDIS_CACHE=false`, `ENABLE_INLINE_SCHEDULER=true`).
- **UptimeRobot**: HTTPS monitor → `https://<your-app>.onrender.com/health/` at 5-min interval keeps the free web service awake 24/7.

---

Made by **karanthedon**
