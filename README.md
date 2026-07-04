# CampusConnect

**One Platform for Students, Faculty & Campus Life**

A full-stack University Management Portal built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure
CampusConnect/
├── client/   → React frontend (Vite)
├── server/   → Node.js + Express backend

## Status

**Project 1 (Phases 1–4): Completed**

| Phase | Title | Status |
|---|---|---|
| 1 | Project Setup & Architecture | Completed |
| 2 | Authentication & Authorization | Completed |
| 3 | Core Dashboards & Profiles | Completed |
| 4 | Student, Faculty & Department Management | Completed |

## Tech Stack

- **Frontend:** React, Vite, Bootstrap, Axios, React Router DOM, React Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcrypt, Google OAuth, Nodemailer (OTP)
- **File Uploads:** Multer
- **Database:** MongoDB Atlas

## Backend Setup

```bash
cd server
npm install
```

Create `.env` in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
npm run dev
```
Runs at `http://localhost:5000` | Health check: `/api/health`

## Frontend Setup

```bash
cd client
npm install
```

Create `.env` in `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

```bash
npm run dev
```
Runs at `http://localhost:5173`

## Folder Structure
server/
├── config/       → Database connection
├── models/       → User, Department schemas
├── routes/       → API routes
├── controllers/  → Business logic
├── middleware/   → Auth, error handling, upload
├── utils/        → JWT, OTP, email helpers
└── uploads/      → Profile pictures
client/src/
├── components/   → layout/, dashboard/, ui/
├── pages/        → auth/, student/, faculty/, admin/
├── context/      → AuthContext, ThemeContext
├── services/     → Axios API calls
├── styles/       → theme colors, shared styles
└── routes/       → AppRoutes, ProtectedRoute

## Database Collections

- **users** — unified model for students, faculty, admins (role-based)
- **departments** — university departments

## API Overview

| Module | Base Route | Access |
|---|---|---|
| Auth | `/api/auth` | Public |
| User Profile | `/api/users` | Private |
| Departments | `/api/departments` | Mixed (read: all, write: admin) |
| Students | `/api/students` | Admin |
| Faculty | `/api/faculty` | Admin |
| Admin Summary | `/api/admin/summary` | Admin |
| Health | `/api/health` | Public |

## Phase Summaries

**Phase 1:** Project foundation — backend server, MongoDB connection, frontend scaffold, verified connectivity.

**Phase 2:** Full authentication — JWT, bcrypt, Google OAuth, OTP-based password recovery, complete auth UI with persistent sessions.

**Phase 3:** Application shell — reusable layout, role-specific dashboards, profile management with image upload, light/dark theme system, animated landing page.

**Phase 4:** Admin data management — full CRUD for Departments, Students, and Faculty with search/filter/pagination, department statistics, and live-data Admin Dashboard.

## Project 1 Milestone — Complete

**Progress:** 4 of 10 phases (40%)

Features: Auth system · Role-based dashboards · Theme system · Department/Student/Faculty CRUD · Department statistics · Live admin dashboard

```bash
git tag project-1-complete
git push origin project-1-complete
```

## Roadmap

| Milestone | Phases | Focus |
|---|---|---|
| **Project 1** ✅ | 1–4 | Foundation, Auth, Dashboards, Core CRUD |
| Project 2 | 5–7 | Attendance, Events & Clubs, Campus Map |
| Project 3 | 8–10 | Search, Analytics, AI Assistant, Deployment |

---
*Internship / portfolio project.*