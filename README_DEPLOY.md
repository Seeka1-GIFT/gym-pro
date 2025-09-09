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

---

# 🚀 One-Click Deployment CLI

This repo includes a deployment CLI for automated frontend builds and uploads.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize deployment config:**
   ```bash
   npm run deploy:init
   ```

3. **Fill `.deployrc.json` with your credentials:**
   ```json
   {
     "viteApiUrl": "https://your-render-app.onrender.com",
     "ftp": {
       "host": "ftp.your-domain.com",
       "user": "username",
       "password": "********",
       "port": 21,
       "secure": false,
       "baseDir": "public_html",
       "protocol": "ftp"
     },
     "render": {
       "apiKey": "your-render-api-key",
       "serviceId": "your-render-service-id"
     }
   }
   ```

## Deploy Commands

- `npm run deploy:build:frontend` → builds Vite with `VITE_API_URL`
- `npm run deploy:upload:frontend` → uploads `dist/` to Hostinger
- `npm run deploy:render` → sets env & triggers Render deploy (if API key provided)
- `npm run deploy:all` → full pipeline (build + upload + render + verify)
- `npm run deploy:verify` → health & summary

## Full Deployment Flow

```bash
# 1. Install dependencies
npm install

# 2. Initialize config
npm run deploy:init

# 3. Fill .deployrc.json with your credentials

# 4. Deploy everything
npm run deploy:all

# 5. Verify deployment
npm run deploy:verify
```

## Render Environment Variables

For Render deployment with API, set these environment variables when running:

```bash
DATABASE_URL="postgresql://...?...sslmode=require" \
JWT_ACCESS_SECRET="your-secret" \
JWT_REFRESH_SECRET="your-secret" \
npm run deploy:render
```