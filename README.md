LiveLink:https://status-tracker-ochre.vercel.app/login
# Task Tracker

Full-stack task tracker built with React, Express, MongoDB, and JWT.

## Features
- Signup/login with JWT
- Task CRUD
- Mark tasks done
- Search by title
- Filter by status and priority
- Sort by due date/priority
- Pagination
- Analytics dashboard
- Responsive UI
- Dark mode
- Centralized API/error handling
- MongoDB indexes
- Basic role support (`user` / `admin`)

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## Run

### Backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

Set `VITE_API_URL` in `client/.env` if the API is not at `http://localhost:5000/api`.
