# 🕷️ Spidey Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-green.svg)](https://nodejs.org/)

A production-grade, full-stack MERN monorepo sighting and incident tracking platform. While the frontend presents a high-tech Spider-Man visual interface, the backend is built on a strictly generic, domain-agnostic tracking architecture ready to support **SignalScout**, **Disaster Tracker**, **Wildlife Tracker**, **Lost Pet Tracker**, or **Emergency Response Tracker**.

---

# 🏛️ System Architecture

Spidey Tracker is organized as an **npm workspaces monorepo**:

```text
SpideyTracker/
├── .ai/             # AI context, frontend/backend architecture & review standards
├── .github/         # Issue and PR templates
├── client/          # React 18 + Vite + TypeScript + Tailwind CSS frontend
├── design/          # Design system, wireframes, mockups, logos and assets
├── docs/            # PRD, SRS, Architecture, Database, API, Roadmap & Testing
├── server/          # Node.js + Express + TypeScript + MongoDB backend
├── package.json     # Monorepo workspace orchestrator
└── tsconfig.base.json
```

---

# 📚 Documentation

Detailed project documentation is available inside the **docs/** directory.

- Product Requirements Document (PRD)
- Software Requirements Specification (SRS)
- Clean Architecture
- Database Design
- API Specification
- Project Roadmap
- Testing Strategy

---

# ✨ Current Features

## Backend

### Core Infrastructure

- Express + TypeScript backend
- MongoDB Atlas integration
- Strict TypeScript configuration
- Zod request validation
- Standardized API response envelopes
- Centralized error handling
- Structured logging
- Health monitoring endpoints

### Authentication & User Profile

- User Registration
- User Login
- Password hashing with bcryptjs
- JWT Access Token generation
- JWT Authentication Middleware
- Bearer Token authentication
- Protected API routes
- Authenticated auth probe endpoint (`GET /api/v1/auth/me`)
- Dedicated User Profile module (`GET /api/v1/users/me`)
- Sanitized user profile DTO (`UserResponseDto`)
- Duplicate username detection
- Duplicate email detection

### Code Quality

- ESLint
- Prettier
- Husky
- lint-staged
- Strict typing
- Layered architecture (Controller → Service → Model)

---

## Frontend

- React 18 + Vite
- TypeScript
- Tailwind CSS
- Cyberpunk-inspired dashboard
- Health status indicator

---

# 🚀 Quick Start

## Prerequisites

- Node.js **20.x** or **22.x**
- npm **10.x** or newer
- MongoDB Atlas (recommended) or local MongoDB

---

## Installation

```bash
git clone https://github.com/Anmol-001/spidey-tracker.git

cd SpideyTracker

npm install
```

---

## Environment Setup

```bash
cp server/.env.example server/.env

cp client/.env.example client/.env
```

Configure the server environment variables:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_secure_secret

JWT_ACCESS_EXPIRES_IN=15m
```

---

## Running the Project

```bash
npm run dev
```

or individually

```bash
npm run dev:server

npm run dev:client
```

---

# 🛠️ Available Scripts

| Command              | Description             |
| -------------------- | ----------------------- |
| npm run dev          | Start client and server |
| npm run dev:server   | Start backend only      |
| npm run dev:client   | Start frontend only     |
| npm run build        | Build all workspaces    |
| npm run type-check   | TypeScript validation   |
| npm run lint         | ESLint                  |
| npm run lint:fix     | Fix ESLint issues       |
| npm run format       | Format using Prettier   |
| npm run format:check | Verify formatting       |

---

# 📡 API Endpoints

## Health

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/health`        |
| GET    | `/api/v1/health` |

Returns

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok"
  }
}
```

---

## Authentication

### Register

```http
POST /api/v1/auth/register
```

Registers a new user.

---

### Login

```http
POST /api/v1/auth/login
```

Authenticates a user and returns a JWT access token.

---

### Authenticated Identity Probe

```http
GET /api/v1/auth/me
```

Protected test endpoint verifying token authentication.

Requires

```text
Authorization: Bearer <access_token>
```

---

## User Profile

### Get Current User Profile

```http
GET /api/v1/users/me
```

Protected endpoint returning the full, sanitized user profile from the database.

Requires

```text
Authorization: Bearer <access_token>
```

Returns

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e1",
    "username": "peterparker",
    "email": "peter.parker@dailybugle.com",
    "role": "citizen",
    "isActive": true,
    "createdAt": "2026-08-08T02:00:00.000Z",
    "updatedAt": "2026-08-08T02:00:00.000Z"
  }
}
```

---

# 🔒 Authentication Flow

```text
Register
      │
      ▼
Login
      │
      ▼
JWT Access Token
      │
      ▼
Authorization: Bearer <token>
      │
      ▼
authenticateUser Middleware
      │
      ▼
req.user
      │
      ▼
Protected Controllers (e.g. UserController)
      │
      ▼
User Service (getProfile)
      │
      ▼
Sanitized DTO Response
```

---

# 🛡️ Coding Standards

- Strict TypeScript (`noImplicitAny`)
- Layered Architecture (Controller → Service → Model)
- Domain-agnostic backend
- Standardized API response envelopes
- Reusable middleware
- Centralized error handling
- JWT-based authentication

---

# 🧪 Quality Assurance

Every sprint undergoes:

- Functional testing
- Regression testing
- API testing using Postman
- JWT validation
- TypeScript compilation
- ESLint verification
- Prettier verification

---

# 🗺️ Project Roadmap

## ✅ Completed

- Sprint 1 – Project Foundation
- Sprint 1.1 – Architecture Cleanup
- Sprint 2.1 – User Registration
- Sprint 2.2 – User Login & JWT Authentication
- Sprint 2.3 – JWT Authentication Middleware
- Sprint 2.4 – Current User Profile Module

## 🚧 In Progress

- Sprint 2.5 – Role-Based Authorization

## 📅 Planned

- Sprint 3 – Incident Management
- Sprint 4 – File Uploads
- Sprint 5 – Interactive Maps
- Sprint 6 – Real-Time Tracking (Socket.IO)
- Sprint 7 – Dashboard & Analytics
- Sprint 8 – Production Deployment

---

# 📄 License

This project is licensed under the MIT License.

See the **LICENSE** file for details.
