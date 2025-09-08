# Deploy Guide: Hostinger (Frontend) + Render (Backend) + Neon (Postgres)

## 1) Database (Neon)
- Create a Neon Postgres project and copy the connection string.
- Ensure it includes `?sslmode=require`.
- Keep this for Render env: DATABASE_URL

## 2) Backend (Render)
- Connect this GitHub repo → New Web Service.
- Root directory: `backend/`.
- Build Command:  `npm ci && npm run build && npm run prisma:migrate`
- Start Command:  `npm start`
- Environment:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `DATABASE_URL=<your neon url with sslmode=require>`
  - `JWT_ACCESS_SECRET=<strong secret>`
  - `JWT_REFRESH_SECRET=<strong secret>`
  - `CORS_ORIGIN=https://YOUR-FRONTEND-DOMAIN.com`
- After deploy, check: `https://YOUR-BACKEND.onrender.com/healthz`

## 3) Frontend (Hostinger)
- In Vite: set `VITE_API_URL` to your Render backend URL (`https://YOUR-BACKEND.onrender.com`).
- Build locally:
```
cd gym-frontend
npm ci
npm run build
```
- Upload the contents of `dist/` to Hostinger `public_html/`.
- Ensure `.htaccess` exists in `public_html/` for SPA routes.
- Enable SSL (Let’s Encrypt) in Hostinger.
- Visit: `https://YOUR-FRONTEND-DOMAIN.com`.

## 4) Sanity checks
- Login flow works (access/refresh tokens).
- Protected API calls succeed (CORS OK).
- Navigation routes work directly (thanks to `.htaccess`).
