# Task Tracker

Full-stack task tracker built with React, Express, MongoDB, and JWT.

Live Application

https://status-tracker-ochre.vercel.app/login

Features

* Signup/login with JWT
* Task CRUD
* Mark tasks as done
* Search by title
* Filter by status and priority
* Sort by due date and priority
* Pagination
* Analytics dashboard
* Responsive UI
* Dark mode
* Centralized API and error handling
* MongoDB indexes
* Basic role support (`user` / `admin`)

## Prerequisites

* Node.js 18+
* MongoDB running locally or a MongoDB Atlas URI

Run

Backend:
open Terminal
cd server
cp .env.example .env
npm install
npm run dev

Frontend:
open terminal
cd client
npm install
npm run dev

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

Set `VITE_API_URL` in `client/.env` if the API is not at `http://localhost:5000/api`.
