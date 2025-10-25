# Calendar App

Full-stack calendar application with Google Calendar integration.

## Tech Stack

**Frontend:**

- React + TypeScript
- Vite
- Chakra UI v3
- TanStack React Query
- date-fns

**Backend:**

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Google APIs (OAuth + Calendar)

## Prerequisites

- [Node.js 20+ and npm](https://nodejs.org/en/download/)
- [PostgreSQL 16+](https://www.postgresql.org/download/)
- [Google Cloud Console account (for OAuth credentials)](https://console.cloud.google.com/)

# Setup Instructions

## 1. Clone the repository

git clone <https://github.com/kresohr/google-calendar-crud>

```
cd google-calendar-crud
```

## 2. Install dependencies

### Install backend dependencies

```
cd server
npm install
```

### Install frontend dependencies

```
cd ../client
npm install
```

## 3. Setup PostgreSQL

In order for this project to work, you will need to have PostgreSQL installed and running on your device.

### Create database using createdb

```
createdb calendar_db
```

### Or by using psql

```
psql -U postgres
```

```
CREATE DATABASE calendar_db;
```

## 4. Configure environment variables

### Copy example env files

Run this from the project root directory

```
cp server/.example.env server/.env
cp client/.example.env client/.env
```

# Edit .env files with your credentials

### 5. Setup Google OAuth

**NOTE**: In order to use this app, you will have to configue Google Cloud Console application to obtain client id and client secret.

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google Calendar API:
   - Navigate to "APIs & Services" > "Library"
   - Search "Google Calendar API"
   - Click "Enable"
4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Configure consent screen if prompted
   - Application type: "Web application"
   - Authorized redirect URIs: http://localhost:3000/auth/google/callback
5. Copy Client ID and Client Secret to server/.env

### 6. Initialize database

```
cd server
npx prisma migrate dev
```

### 7. Run the application

#### Terminal 1: Start backend

Make sure you are in /server

```
cd server
npm run dev
```

#### Terminal 2: Start frontend

Make sure you are in /client

```
cd client
npm run dev
```

### 8. Access the application

Frontend: http://localhost:5173
Backend: http://localhost:3000

## Environment Variables

See .example.env for required environment variables in both client and server.

Required variables for client:

- VITE_API_URL: URL of backend (http://localhost:3000)

Required variables for server:

- CLIENT_URL: URL for frontend (http://localhost:5173)
- DATABASE_URL: PostgreSQL connection string
- SESSION_SECRET: Random secret for session encryption
- GOOGLE_CLIENT_ID: From Google Cloud Console
- GOOGLE_CLIENT_SECRET: From Google Cloud Console
- GOOGLE_REDIRECT_URI: OAuth callback URL

## Available Scripts

### Frontend (client/)

- npm run dev: Start Vite development server
- npm run build: Build for production
- npm run preview: Preview production build
- npm run lint: Run ESLint

### Backend (server/)

- npm run dev: Start development server with hot reload
- npm run build: Build server for production
- npm start: Run production build
- npm run prisma:migrate: Run database migrations
- npm run prisma:generate: Generate Prisma client

## Troubleshooting

### Database connection issues

- Verify PostgreSQL is running
- Check DATABASE_URL in server/.env
- Run: npx prisma migrate dev

### OAuth errors

- Verify redirect URI matches Google Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure Google Calendar API is enabled

### Frontend not connecting to backend

- Check VITE_API_URL in client/.env
- Verify backend is running on port 3000
- Check browser console for CORS errors

## License

MIT
