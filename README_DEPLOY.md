# Deploy Guide (Render + Neon + Hostinger)

## 1) Make GitHub repo Public
GitHub → Settings → General → Danger Zone → Change visibility → Public.

## 2) Database (Neon)
- Create PostgreSQL database in Neon
- Copy connection string with `?sslmode=require`
- Use as `DATABASE_URL`

## 3) Backend (Render)
- **New Web Service** from this repo
- Root directory: `backend`
- Set environment variables:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `DATABASE_URL=<Neon URL with ?sslmode=require>`
  - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (strong secrets)
  - `CORS_ORIGIN=https://your-frontend-domain`

## 4) Frontend (Hostinger)
- Build with `VITE_API_URL` pointing to the Render backend
- Upload `gym-frontend/dist/` to Hostinger `public_html/` (ensure `.htaccess` for SPA is present)

## 5) Verify
- Backend `/healthz`
- Pages load
- Login works
- CORS OK
