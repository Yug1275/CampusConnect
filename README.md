<div align="center">

# CampusConnect

**One Platform for Students, Faculty & Campus Life**

A production-grade, full-stack University Management Portal built using the MERN Stack — combining authentication, academic management, attendance, events, campus navigation, analytics, and an AI-style FAQ assistant into a single, unified platform.

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)]()
[![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey)]()
[![React](https://img.shields.io/badge/React-Frontend-blue)]()
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-brightgreen)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

</div>

CampusConnect is a full-stack university management system that unifies authentication, academics, attendance, events, clubs, campus navigation, analytics, feedback, and lost & found into a single, role-aware platform for students, faculty, and administrators — built end-to-end across 10 structured development phases.

---

# 📖 Table of Contents

- [✨ Features](#-features)
- [🎓 Roles & Permissions](#-roles--permissions)
- [🏗️ Architecture](#️-architecture)
- [🖥️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📡 API Reference](#-api-reference)
- [🔧 Configuration](#-configuration)
- [🎨 Design System](#-design-system)
- [📂 Project Structure](#-project-structure)
- [🗺️ Development Roadmap](#️-development-roadmap)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

# ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Full Authentication** | JWT + bcrypt, Google OAuth, OTP-based password recovery, role-based authorization (student/faculty/admin) |
| 🎨 **Light/Dark Theme** | Persistent, system-aware theme switching across the entire application |
| 🧑‍🎓 **Student/Faculty/Department Management** | Full CRUD with search, filtering, and pagination for admin |
| ✅ **Attendance System** | Manual bulk marking, QR-code self-attendance, Chart.js visual history, live percentage tracking |
| 🎉 **Events & Ticketing** | Event creation, capacity-enforced registration, QR event tickets with organizer check-in scanning |
| 🏛️ **Clubs** | Category-based club directory with join/leave membership tracking |
| 🗺️ **Campus Map & Navigation** | Interactive Leaflet map with category-coded markers, live open/closed status, straight-line navigation with distance/time estimation |
| 📢 **Announcements** | Role & department-targeted broadcast system with a searchable feed |
| 🔍 **Global Search** | Live, categorized search across Students, Faculty, Departments, Clubs, Events, and Announcements |
| 🔔 **Notifications** | Personal notification inbox with unread tracking, auto-generated on key events (absences, registrations, announcements) |
| 📊 **Analytics Dashboard** | Attendance trends, department/faculty distribution, club membership, and event participation — all via Chart.js |
| 💬 **Feedback System** | Anonymous or named feedback targeting faculty/subjects/general campus, with admin oversight |
| 🎒 **Lost & Found** | Report, browse, claim, and admin-verified item recovery |
| 🤖 **FAQ Chatbot** | Rule-based, keyword-matched assistant with an admin-manageable knowledge base |
| 🪪 **Digital Student ID** | QR-coded ID card with one-click PDF export |
| 🏅 **Achievement Badges** | Automatically awarded based on real attendance, club, and event activity |
| 📱 **Fully Responsive** | Off-canvas mobile navigation, adaptive layouts across every module |

---

# 🎓 Roles & Permissions

| Capability | Student | Faculty | Admin |
|---|:---:|:---:|:---:|
| Dashboard, Profile, Theme | ✅ | ✅ | ✅ |
| Mark / Scan Attendance | View only | ✅ Mark | ✅ Mark |
| Manage Departments/Students/Faculty/Subjects | ❌ | ❌ | ✅ |
| Create Events, Clubs, Announcements | ❌ | Events, Announcements | ✅ All |
| Register for Events / Join Clubs | ✅ | ❌ | ❌ |
| Submit Feedback | ✅ | ❌ | ❌ |
| Review Feedback | ❌ | Own-targeted | ✅ All |
| Verify Lost & Found Claims | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ❌ | ✅ |

---

# 🏗️ Architecture

> Architecture diagram — *coming soon*

> Sequence diagram (Auth + Attendance flow) — *coming soon*

CampusConnect follows a classic three-tier MERN architecture:

```text
React (Vite) ── Axios ──> Express.js REST API ── Mongoose ──> MongoDB Atlas
      │                           │
  Leaflet.js                  JWT Middleware
  Chart.js               Role-Based Access Control
  QR Scan/Gen              Multer (File Uploads)
```

Every protected route flows through a shared `protect` (JWT verification) and `authorize(...roles)` middleware chain, applied consistently across all 20+ resource modules.

---

# 🖥️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React (Vite) | UI Framework & Build Tool |
| React Router DOM | Client-side routing |
| Bootstrap | Base grid & utility classes |
| Axios | HTTP client with interceptors |
| Chart.js / react-chartjs-2 | Attendance & Analytics visualizations |
| Leaflet / react-leaflet | Campus map & navigation |
| html5-qrcode | QR code camera scanning |
| qrcode.react | QR code generation |
| html2canvas + jsPDF | Digital ID PDF export |
| React Icons | Icon system |

## Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API framework |
| MongoDB Atlas + Mongoose | Database & ODM |
| JWT + bcrypt | Authentication & password hashing |
| Google OAuth (google-auth-library) | Social login |
| Nodemailer | OTP email delivery |
| Multer | Profile picture uploads |

## Infrastructure

| Technology | Purpose |
|---|---|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| MongoDB Atlas | Cloud Database |

---

# 🚀 Getting Started

## Prerequisites

- Node.js ≥ 18.x
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- Gmail account with an App Password (for OTP emails)

## 1. Clone the Repository

```bash
git clone https://github.com/Yug1275/CampusConnect.git
cd CampusConnect
```

## 2. Backend Setup

```bash
cd server
npm install

cp .env.example .env

# Fill in:
# MONGO_URI
# JWT_SECRET
# EMAIL_USER
# EMAIL_PASS
# GOOGLE_CLIENT_ID

npm run dev
```

The API will be available at:

```
http://localhost:5000
```

Health Check:

```
http://localhost:5000/api/health
```

## 3. Frontend Setup

```bash
cd client
npm install

cp .env.example .env

# Set:
# VITE_API_BASE_URL=http://localhost:5000/api
# VITE_GOOGLE_CLIENT_ID=<same Google Client ID>

npm run dev
```

Application:

```
http://localhost:5173
```

## 4. Seed the Chatbot (Optional)

The FAQ chatbot starts empty. Seed a few entries using:

```http
POST /api/chatbot/faqs
```

*(Admin token required.)*

---

# 📡 API Reference

### Health Check

```http
GET /api/health
```
```json
{
  "success": true,
  "message": "CampusConnect API is running",
  "environment": "development"
}
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Chatbot

```http
POST /api/chatbot/ask
Content-Type: application/json

{
  "message": "Where is the library?"
}
```

**Response**

```json
{
  "success": true,
  "answer": "The Central Library is open 8 AM - 10 PM. Check the Campus Map for its exact location.",
  "matched": true
}
```

### Core Modules

| Module | Base Route |
|---|---|
| Users / Profile | `/api/users` |
| Departments | `/api/departments` |
| Students | `/api/students` |
| Faculty | `/api/faculty` |
| Subjects | `/api/subjects` |
| Attendance | `/api/attendance` |
| Attendance QR Sessions | `/api/attendance/qr` |
| Events & Registration | `/api/events` |
| Clubs & Membership | `/api/clubs` |
| Locations (Campus Map) | `/api/locations` |
| Announcements | `/api/announcements` |
| Global Search | `/api/search` |
| Notifications | `/api/notifications` |
| Analytics | `/api/analytics` |
| Feedback | `/api/feedback` |
| Lost & Found | `/api/lostfound` |
| Chatbot | `/api/chatbot` |
| Badges | `/api/badges` |

*Full request/response examples for each module are documented inline in the corresponding controller files.*

---

# 🔧 Configuration

### Backend `.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Google OAuth Setup

1. Create a project in Google Cloud Console.
2. Configure the OAuth Consent Screen.
3. Create an OAuth 2.0 Client ID (Web Application).
4. Add `http://localhost:5173` under Authorized JavaScript Origins.
5. Use the same Client ID in both `.env` files.

---

# 🎨 Design System

CampusConnect uses a custom slate/blue design language with complete Light/Dark theme support.

| Token | Light | Dark |
|---|---|---|
| Page Background | `#f8fafc` | `#0f172a` |
| Card Background | `#ffffff` | `#1e293b` |
| Accent | `#2563eb` | `#60a5fa` |
| Navbar | `#1e293b` | `#0f172a` |

Theme colors are centralized in:

`client/src/styles/themeColors.js`

and consumed through `useTheme()`.

---

# 📂 Project Structure

```text
CampusConnect/
├── server/
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── uploads/
│   └── server.js
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   ├── dashboard/
    │   │   ├── ui/
    │   │   ├── chatbot/
    │   │   ├── events/
    │   │   ├── clubs/
    │   │   └── map/
    │   │
    │   ├── pages/
    │   │   ├── auth/
    │   │   ├── admin/
    │   │   ├── faculty/
    │   │   ├── student/
    │   │   └── shared/
    │   │
    │   ├── context/
    │   ├── services/
    │   ├── styles/
    │   └── routes/
    │
    └── vite.config.js
```

---

# 🗺️ Development Roadmap

CampusConnect was built across 10 development phases, grouped into three major milestones.

| Milestone | Phases | Focus | Status |
|---|---|---|---|
| **Project 1** | 1–4 | Foundation, Authentication, Dashboards & CRUD | ✅ Complete |
| **Project 2** | 5–7 | Attendance, Events, Clubs & Campus Map | ✅ Complete |
| **Project 3** | 8–10 | Search, Analytics, AI Assistant & Deployment | ✅ Complete |

<details>
<summary><strong>Full Phase Breakdown</strong></summary>

1. Project Setup & Architecture
2. Authentication & Authorization
3. Core Dashboards & Profiles
4. Student, Faculty & Department Management
5. Attendance Management
6. Events & Clubs
7. Campus Map & Navigation
8. Announcements, Search & Notifications
9. Analytics, Feedback & Lost & Found
10. AI Assistant, Digital ID, Badges, Theme & Deployment

</details>

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes.
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch.
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request.

---

# 📝 License

This project was developed for educational and portfolio purposes as part of an internship program.

<div align="center">
<br/>
🚀 Built as a Full-Stack Internship Project<br/>
CampusConnect v1.0<br/><br/>
Made with ❤️ using the MERN Stack
</div>