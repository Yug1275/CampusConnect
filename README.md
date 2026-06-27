# CampusConnect

**One Platform for Students, Faculty & Campus Life**

CampusConnect is a full-stack University Management Portal built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure
CampusConnect/

├── client/   → React frontend (Vite)

├── server/   → Node.js + Express backend

## Status

Phase 1: Project Setup & Architecture — Completed

## Tech Stack

- Frontend: React, Vite, Bootstrap, Axios, React Router DOM
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT, bcrypt, Google OAuth (upcoming in Phase 2)
- Database: MongoDB Atlas

## Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/` based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Run the backend:

```bash
npm run dev
```

Server runs at `http://localhost:5000`. Health check available at `http://localhost:5000/api/health`.

## Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Backend Folder Structure
server/

├── config/        → Database connection

├── models/         → Mongoose schemas (Phase 2 onward)

├── routes/         → API routes (Phase 2 onward)

├── controllers/     → Business logic (Phase 2 onward)

├── middleware/      → Error handling, logging, auth guards

├── utils/          → Helper functions

├── uploads/        → File upload storage

└── server.js       → Entry point

## Frontend Folder Structure
client/src/

├── components/    → Reusable UI components (Phase 3 onward)

├── pages/         → Page-level views

├── context/       → React Context providers (Phase 2 onward)

├── services/      → Axios API calls

├── hooks/         → Custom React hooks

├── utils/         → Helper functions

└── routes/        → Route configuration

## Phase 1 Summary

Phase 1 establishes the complete project foundation: repository structure, backend server with database connectivity and error handling, frontend scaffold with routing and styling, and verified end-to-end connectivity between both applications.