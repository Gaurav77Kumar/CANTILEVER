# Taskflow — Task Management App

A full-stack task management application with user authentication, task CRUD, filtering/sorting, and a responsive interface for mobile and desktop.

**Stack:** React 18 (Vite) · Node.js + Express · MongoDB (Mongoose) · JWT authentication

## Features

- **Authentication** — register, login, logout, and session restore; passwords hashed with bcrypt, API access via JWT bearer tokens
- **Task CRUD** — create, read, update, and delete tasks with title, description, status (`todo` / `in-progress` / `completed`), priority (`low` / `medium` / `high`), and due date
- **Filtering & sorting** — filter by status and priority; sort by newest, oldest, or title; paginated results
- **Responsive design** — mobile-first layout that adapts from phones to wide desktops
- **Per-user data** — every task is scoped to its owner; users never see each other's tasks

## Project structure

```
.
├── backend/
│   ├── server.js              # Entry point: env checks, DB connect, graceful shutdown
│   ├── app.js                 # Express app: security, CORS, routes, error handling
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # User, Task Mongoose models
│   ├── routes/                # /api/auth, /api/tasks
│   ├── middleware/auth.js     # JWT verification
│   ├── scripts/preview.js     # Disposable in-memory API for UI testing
│   ├── test/api.test.js       # API integration tests (node --test)
│   └── .env.example           # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with auth interceptor
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/             # AuthPage (login/register), Dashboard
│   │   ├── components/        # TaskForm, TaskItem, TaskFilters
│   │   └── App.jsx
│   └── vite.config.js         # Dev proxy: /api → localhost:5000
└── README.md
```

## Prerequisites

- Node.js 20+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or a MongoDB Atlas URI)

## Getting started

1. **Configure the backend**

   ```bash
   cd backend
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.
   Edit `backend/.env` and set `JWT_SECRET` to a cryptographically random secret of at least 32 characters. Adjust `MONGO_URI` if your database is elsewhere. Never commit this file.

2. **Start the backend** (port 5000)

   ```bash
   npm install
   npm run dev
   ```

3. **Start the frontend** (port 5173, proxies `/api` to port 5000)

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. Open http://localhost:5173, register an account, and start adding tasks.

## API overview

All task routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account, returns token + user |
| POST | `/api/auth/login` | Sign in, returns token + user |
| GET | `/api/auth/me` | Current user (session restore) |
| GET | `/api/tasks` | List tasks — `?status=&priority=&sort=newest|oldest|title&page=` |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get one task |
| PATCH | `/api/tasks/:id` | Update any task fields |
| DELETE | `/api/tasks/:id` | Delete a task |

## Tests

Backend integration tests cover registration, login, task CRUD, filtering/sorting, validation, and per-user data isolation. They run against an isolated in-memory MongoDB instance and never touch your configured database:

```bash
cd backend
npm test
```



