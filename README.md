# CampusConnect

**One Platform for Students, Faculty & Campus Life**

A full-stack University Management Portal built using the MERN Stack (MongoDB, Express.js, React.js, Node.js)

## Project Structure

```
CampusConnect/
├── client/   → React frontend (Vite)
├── server/   → Node.js + Express backend
```

## Status

**Project 2 (Phases 1–7): Completed**

| Phase | Title | Status |
|---|---|---|
| 1 | Project Setup & Architecture | ✅ Completed |
| 2 | Authentication & Authorization | ✅ Completed |
| 3 | Core Dashboards & Profiles | ✅ Completed |
| 4 | Student, Faculty & Department Management | ✅ Completed |
| 5 | Attendance Management | ✅ Completed |
| 6 | Events & Clubs Management | ✅ Completed |
| 7 | Campus Map & Navigation | ✅ Completed |

---

## Tech Stack

- **Frontend:** React, Vite, Bootstrap, Axios, React Router DOM, React Icons, Leaflet, Chart.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt, Google OAuth, Nodemailer (OTP)
- **Maps:** React Leaflet + OpenStreetMap
- **QR Code:** QRCode, QR Scanner
- **File Uploads:** Multer
- **Database:** MongoDB Atlas

---

## Backend Setup

```bash
cd server
npm install
```

Create `.env` inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start backend

```bash
npm run dev
```

Runs at:

```
http://localhost:5000
```

Health Check

```
/api/health
```

---

## Frontend Setup

```bash
cd client
npm install
```

Create `.env` inside `client/`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Run frontend

```bash
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

## Folder Structure

```
server/
├── config/            → Database connection
├── models/            → User, Department, Subject, Attendance,
│                        Event, Club, Location schemas
├── routes/            → API routes
├── controllers/       → Business logic
├── middleware/        → Authentication, uploads, error handling
├── utils/             → JWT, OTP, email, geo helpers
└── uploads/           → Profile & location images

client/src/
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── map/
│   └── ui/
├── pages/
│   ├── admin/
│   ├── student/
│   ├── faculty/
│   ├── shared/
│   └── auth/
├── context/
├── services/
├── routes/
├── styles/
└── utils/
```

---

## Database Collections

- **users** — Students, Faculty & Admins
- **departments**
- **subjects**
- **attendances**
- **attendancesessions**
- **events**
- **eventregistrations**
- **clubs**
- **clubmemberships**
- **locations**

---

## API Overview

| Module | Base Route | Access |
|---|---|---|
| Auth | `/api/auth` | Public |
| User Profile | `/api/users` | Private |
| Departments | `/api/departments` | Mixed |
| Students | `/api/students` | Admin |
| Faculty | `/api/faculty` | Admin |
| Subjects | `/api/subjects` | Faculty/Admin |
| Attendance | `/api/attendance` | Faculty/Student |
| Attendance QR | `/api/attendance-sessions` | Faculty/Student |
| Events | `/api/events` | Mixed |
| Event Registration | `/api/event-registrations` | Student |
| Clubs | `/api/clubs` | Mixed |
| Club Membership | `/api/club-memberships` | Student |
| Locations | `/api/locations` | Mixed |
| Admin Summary | `/api/admin/summary` | Admin |
| Health | `/api/health` | Public |

---

# Phase Summaries

### Phase 1

Project foundation with backend server, MongoDB Atlas connection, React (Vite) frontend setup, routing, API connectivity, and complete project architecture.

### Phase 2

Complete authentication system including JWT authentication, bcrypt password hashing, Google OAuth login, OTP-based password recovery, protected routes, persistent login sessions, and role-based authorization.

### Phase 3

Role-based dashboards for Students, Faculty, and Admins, reusable layouts, profile management with image upload, animated landing page, and light/dark theme support.

### Phase 4

Complete Department, Student, and Faculty Management modules with CRUD operations, pagination, searching, filtering, department statistics, and live admin dashboard.

### Phase 5

Complete Attendance Management System including:

- Subject Management
- Faculty attendance sessions
- Bulk attendance marking
- Student attendance history
- Attendance analytics using Chart.js
- QR-code based attendance
- Attendance session management

### Phase 6

Campus Activities Module including:

- Event CRUD
- Student event registration
- Capacity management
- QR event tickets
- Organizer QR check-in
- Club CRUD
- Club membership (Join/Leave)
- Dashboard integrations

### Phase 7

Complete Campus Map & Navigation System including:

- Location Management CRUD
- 10 categorized campus locations
- Interactive Leaflet campus map
- Color-coded custom markers
- Rich location details
- Live Open/Closed status
- Contact information
- Campus navigation with estimated distance & walking time
- Live search with fly-to-location
- Dashboard shortcuts for all roles

---

# Project 2 Milestone — Complete

**Progress:** **7 of 10 Phases Completed (70%)**

### Features Completed

- JWT Authentication
- Google OAuth Login
- OTP Password Recovery
- Role-Based Authorization
- Student Dashboard
- Faculty Dashboard
- Admin Dashboard
- Profile Management
- Theme System
- Department Management
- Student Management
- Faculty Management
- Subject Management
- Attendance Management
- Attendance Analytics
- QR Attendance
- Event Management
- Event Registration
- Event QR Tickets
- Event Check-in
- Club Management
- Club Membership
- Campus Map
- Campus Navigation
- Live Location Search
- Dashboard Integrations

---

## Project Statistics

| Category | Count |
|-----------|------:|
| Completed Phases | **7 / 10** |
| Database Collections | **10** |
| REST APIs | **35+** |
| React Components | **25+** |
| User Roles | **3** |
| Campus Location Categories | **10** |


## Roadmap

| Milestone | Phases | Focus | Status |
|---|---|---|---|
| **Project 1** | 1–4 | Foundation, Authentication, Dashboards, Core CRUD | ✅ Complete |
| **Project 2** | 5–7 | Attendance, Events, Clubs, Campus Map & Navigation | ✅ Complete |
| **Project 3** | 8–10 | Search, Analytics, AI Assistant & Deployment | 🚀 Upcoming |

### Upcoming Phases

- **Phase 8** — Announcements, Global Search & Notifications
- **Phase 9** — Analytics, Feedback & Lost and Found
- **Phase 10** — AI Assistant, Digital ID, Achievement Badges, Theme Enhancements & Deployment

---

*Internship / Portfolio Project*