# JS Study Hub

JS Study Hub is a collaborative web application designed for small groups (3–5 members) to learn JavaScript together, complete daily exercises, upload solutions, and track mutual progress.

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, React
- **Backend:** NestJS, TypeScript, REST API, Prisma ORM
- **Database:** PostgreSQL
- **Storage:** Supabase Storage / S3-compatible storage

## Project Structure

```
Study_Hub/
├── frontend/          # Next.js App Router frontend application
├── backend/           # NestJS REST API backend application
├── .ai/               # AI engineering skill bundles
├── design/            # UI reference screenshots
└── master_prompt.md   # Functional & architectural specifications
```

## Environment Configuration

### Backend (`backend/.env`)
```env
PORT=3001
DATABASE_URL="postgresql://admin:admin123@localhost:5432/js_study_hub?schema=public"
JWT_SECRET="js-study-hub-secret-key-change-in-production"
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_SERVICE_KEY="your-supabase-service-key"
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

## Running the Application

### 1. Database Setup
Ensure PostgreSQL is running on port 5432 with database `js_study_hub`. Push Prisma schema:
```bash
cd backend
npx prisma db push
```

### 2. Run Backend
```bash
cd backend
npm run start:dev
```
Backend API will be running at: `http://localhost:3001/api`  
Health Check: `http://localhost:3001/api/health`

### 3. Run Frontend
```bash
cd frontend
npm run dev
```
Frontend Web App will be running at: `http://localhost:3000`
