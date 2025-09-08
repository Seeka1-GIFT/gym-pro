# Gym Monorepo

This repository contains a Node/Express/Prisma backend and a Vite/React frontend.

## Structure
- `backend/`: Node + Express + TypeScript + Prisma
- `gym-frontend/`: Vite + React app

## Backend
- Install: `cd backend && npm ci`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

Environment variables (see `backend/env.example`):
- `DATABASE_URL` (with `?sslmode=require`)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `PORT`, `NODE_ENV`

## Frontend
- Install: `cd gym-frontend && npm ci`
- Dev: `npm run dev`
- Build: `npm run build`

Set `VITE_API_URL` in `gym-frontend/.env` (do not commit).

## Deployment
See `DEPLOY.md` for Render (backend), Hostinger (frontend), and Neon (Postgres).
