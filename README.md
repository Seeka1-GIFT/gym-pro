# Gym Management System

A full-stack gym management application with member tracking, attendance, payments, and analytics.

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Database**: PostgreSQL (Neon in production)
- **Deployment**: Render (backend) + Hostinger (frontend)

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm ci
cp env.example .env  # Edit with your values
npm run dev
```

### Frontend Setup
```bash
cd gym-frontend
npm ci
cp .env.example .env  # Edit with your backend URL
npm run dev
```

## 📋 Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (`gym-frontend/.env`)
```env
VITE_API_URL=https://your-backend-domain.com
```

## 🛠️ Development

### Backend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - TypeScript type checking
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. Set build command: `npm ci && npm run build && npm run prisma:migrate`
3. Set start command: `npm start`
4. Configure environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL` (from Neon)
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGIN` (your frontend domain)

### Frontend (Hostinger/Static)
1. Build locally: `npm run build`
2. Upload `dist/` contents to `public_html/`
3. Ensure `.htaccess` is present for SPA routing
4. Set `VITE_API_URL` to your Render backend URL

### Database (Neon)
1. Create PostgreSQL database on Neon
2. Copy connection string with `?sslmode=require`
3. Use as `DATABASE_URL` in Render

## 🔧 Features

- **Member Management**: Add, edit, view members
- **Membership Plans**: Create and manage subscription plans
- **Attendance Tracking**: QR code check-in system
- **Payment Processing**: Track payments and dues
- **Expense Management**: Record gym expenses
- **Asset Management**: Track gym equipment
- **Analytics Dashboard**: Revenue and attendance insights
- **Role-based Access**: Admin and member roles

## 📁 Project Structure

```
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── middleware/     # Express middleware
│   │   └── config/         # Configuration
│   └── prisma/            # Database schema & migrations
├── gym-frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── features/      # Feature-specific code
│   │   └── lib/          # Utilities and API client
└── .github/workflows/     # CI/CD pipelines
```

## 🧪 Testing

The project includes:
- ESLint for code quality
- TypeScript for type safety
- GitHub Actions for CI/CD

## 📄 License

This project is licensed under the MIT License.
