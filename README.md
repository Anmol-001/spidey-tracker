# 🕷️ Spidey Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-green.svg)](https://nodejs.org/)

A production-grade, full-stack MERN monorepo sighting and incident tracking platform. While the frontend presents a high-tech Spider-Man visual interface, the backend is built on a strictly generic, domain-agnostic tracking architecture ready to support **SignalScout**, **Disaster Tracker**, **Wildlife Tracker**, **Lost Pet Tracker**, or **Emergency Response Tracker**.

---

## 🏛️ System Architecture

Spidey Tracker is organized as an **npm workspaces monorepo**:

```
SpideyTracker/
├── .ai/             # AI context, frontend/backend architecture, & review standards
├── .github/         # Issue and PR templates
├── client/          # React 18 + Vite + TypeScript + Tailwind CSS frontend
├── design/          # Design system, wireframes, mockups, logos, and assets
├── docs/            # Standardized documentation (PRD, SRS, Architecture, DB, API, Roadmap)
├── server/          # Node.js + Express + TypeScript + MongoDB backend
├── package.json     # Monorepo root workspace orchestrator
└── tsconfig.base.json # Shared strict TypeScript configuration
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](docs/) directory:

- [01 - Product Requirements Document (PRD)](docs/01-prd.md)
- [02 - Software Requirements Specification (SRS)](docs/02-srs.md)
- [03 - Clean Architecture & System Design](docs/03-architecture.md)
- [04 - Database Design & Models](docs/04-database.md)
- [05 - API Specification & Standards](docs/05-api.md)
- [06 - Project Milestone Roadmap](docs/06-roadmap.md)
- [07 - Testing Strategy & QA](docs/07-testing.md)

---
## ✨ Current Features

### Backend

- Health monitoring endpoints
- User registration
- Password hashing with bcrypt
- Zod request validation
- MongoDB persistence
- Duplicate email detection
- Duplicate username detection
- Standardized API responses

### Frontend

- React + Vite dashboard
- Health status indicator
- Cyberpunk-inspired UI foundation

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or `v11.x`
- **MongoDB**: MongoDB Atlas (recommended) or a local MongoDB instance

### Installation

```bash
# Clone the repository
git clone https://github.com/spideytracker/spideytracker.git
cd SpideyTracker

# Install dependencies across all workspaces
npm install
```

### Environment Setup

Copy example environments:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

### Running Locally

```bash
# Start both client and server concurrently
npm run dev

# Start only server (port 5000)
npm run dev:server

# Start only client (port 5173)
npm run dev:client
```

---

## 🛠️ Monorepo Scripts

| Command                | Description                                                   |
| :--------------------- | :------------------------------------------------------------ |
| `npm run dev`          | Start both client and server in development mode concurrently |
| `npm run build`        | Build both client and server for production                   |
| `npm run type-check`   | Execute TypeScript strict compiler check across all packages  |
| `npm run lint`         | Run ESLint across monorepo                                    |
| `npm run lint:fix`     | Automatically fix ESLint violations across monorepo           |
| `npm run format`       | Run Prettier across all files                                 |
| `npm run format:check` | Verify code formatting compliance with Prettier               |

---

## 📡 API Specification (Sprint 1)

### `GET /health` & `GET /api/v1/health`

Returns operational telemetry confirming the backend server status.

- **Response Format**:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok"
  }
}
```
### `POST /api/v1/auth/register`

Registers a new user account.

**Request Body**

```json
{
  "username": "PeterParker",
  "email": "peter@example.com",
  "password": "Spider@123"
}
```

**Success Response (201)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "username": "PeterParker",
    "email": "peter@example.com",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Validation**

- Username: 3–30 characters
- Email: Valid email format
- Password: Minimum 8 characters with uppercase, lowercase, number, and special character

**Possible Responses**

- 201 Created
- 400 Bad Request
- 409 Conflict

---

## 🛡️ Coding Standards & Invariants

- **Zero Any Policy**: Strict TypeScript compilation with `noImplicitAny: true`.
- **Clean Layered Architecture**: Controllers $\rightarrow$ Services $\rightarrow$ Data Access.
- **Consistent Response Envelopes**: All endpoints adhere to `{ success, message, data?, error? }`.
- **Domain-Agnostic Backend**: Backend contains zero hard-coded Spider-Man domain logic.

---
## 🗺️ Roadmap

- ✅ Sprint 1 — Project Foundation
- ✅ Sprint 2.1 — User Registration
- ⏳ Sprint 2.2 — User Login
- ⏳ Sprint 2.3 — JWT Authentication
- ⏳ Sprint 3 — Incident Reporting
- ⏳ Sprint 4 — Interactive Maps
- ⏳ Sprint 5 — Real-time Tracking
- ⏳ Sprint 6 — Dashboard & Analytics
- ⏳ Sprint 7 — Production Deployment
## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
