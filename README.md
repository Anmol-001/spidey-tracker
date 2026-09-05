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

### Authentication & Authorization

- User Registration
- User Login
- Password hashing with bcryptjs (12 salt rounds)
- JWT Access Token generation
- JWT Authentication Middleware (`authenticateUser`)
- Role-Based Authorization Middleware (`authorizeRoles`)
- Role-aware request context (`req.user.role`)
- Bearer Token authentication
- Protected API routes with granular role-based access control
- Authenticated auth probe endpoint (`GET /api/v1/auth/me`)
- Dedicated User Profile module (`GET /api/v1/users/me`)
- Sanitized user profile DTO (`UserResponseDto`)
- Duplicate username detection
- Duplicate email detection

### Incident Management

- Incident domain module
- Create Incident API (`POST /api/v1/incidents`)
- List Incidents API (`GET /api/v1/incidents`) with offset pagination, filtering, and deterministic ordering
- Incident Detail API (`GET /api/v1/incidents/:id`) with 24-hex ObjectId validation and 404 handling
- Protected incident reporting for authenticated users
- Strict Zod request validation for incident creation and query parameters
- Secure backend-managed incident defaults (`createdBy`, `status`, `severity`, `assignedTo`)
- Incident persistence with MongoDB and optimized schema indexes

### Security Features

- Password hashes strictly excluded from all API responses and database transforms
- JWT secrets and expiration fully environment-driven
- Real-time role verification directly sourced from MongoDB during authentication
- Fail-safe authorization error handling returning standardized `401 Unauthorized` and `403 Forbidden` envelopes

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

## Incident Management

### Report Incident

```http
POST /api/v1/incidents
```

Protected endpoint to report a new incident.

Requires

```text
Authorization: Bearer <access_token>
```

Request Body

```json
{
  "title": "Bank robbery in progress",
  "description": "Armed robbery reported at Financial District branch.",
  "category": "crime",
  "latitude": 40.7128,
  "longitude": -74.006,
  "address": "123 Wall St, New York, NY"
}
```

Returns `201 Created`

```json
{
  "success": true,
  "message": "Incident reported successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e2",
    "title": "Bank robbery in progress",
    "description": "Armed robbery reported at Financial District branch.",
    "category": "crime",
    "severity": "medium",
    "status": "open",
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Wall St, New York, NY",
    "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
    "assignedTo": null,
    "createdAt": "2026-08-08T15:00:00.000Z",
    "updatedAt": "2026-08-08T15:00:00.000Z"
  }
}
```

- **Authentication Requirement**: Valid Bearer token required for all roles (`citizen`, `responder`, `admin`).
- **Validation Behavior**: Strict schema validation ensures coordinate bounds, required string lengths, valid categories, and rejects unauthorized properties (`status`, `severity`, `createdBy`, `assignedTo`).
- **Default Backend Fields**: Automatically assigns `status = open`, `severity = medium`, `assignedTo = null`, and associates `createdBy` with the authenticated user ID.

---

### List Incidents

```http
GET /api/v1/incidents?page=1&limit=20&status=open&severity=medium&category=crime
```

Protected endpoint to retrieve a paginated list of incidents sorted newest-first.

Requires

```text
Authorization: Bearer <access_token>
```

Query Parameters:

- `page`: Page number (integer >= 1, default: `1`)
- `limit`: Items per page (integer 1-100, default: `20`)
- `category`: Optional filter (`crime`, `fire`, `accident`, `medical`, `natural_disaster`, `other`)
- `severity`: Optional filter (`low`, `medium`, `high`, `critical`)
- `status`: Optional filter (`open`, `in_progress`, `resolved`)

Returns `200 OK`

```json
{
  "success": true,
  "message": "Incidents retrieved successfully",
  "data": {
    "items": [
      {
        "id": "66b1a2c3d4e5f6a7b8c9d0e2",
        "title": "Bank robbery in progress",
        "description": "Armed robbery reported at Financial District branch.",
        "category": "crime",
        "severity": "medium",
        "status": "open",
        "latitude": 40.7128,
        "longitude": -74.006,
        "address": "123 Wall St, New York, NY",
        "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
        "assignedTo": null,
        "createdAt": "2026-08-08T15:00:00.000Z",
        "updatedAt": "2026-08-08T15:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Incident by ID

```http
GET /api/v1/incidents/:id
```

Protected endpoint to retrieve a specific incident by its 24-character hex ObjectId.

Requires

```text
Authorization: Bearer <access_token>
```

Returns `200 OK`

```json
{
  "success": true,
  "message": "Incident retrieved successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e2",
    "title": "Bank robbery in progress",
    "description": "Armed robbery reported at Financial District branch.",
    "category": "crime",
    "severity": "medium",
    "status": "open",
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Wall St, New York, NY",
    "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
    "assignedTo": null,
    "createdAt": "2026-08-08T15:00:00.000Z",
    "updatedAt": "2026-08-08T15:00:00.000Z"
  }
}
```

---

# 🔒 Authentication & Authorization Flow

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
authenticateUser Middleware (verifies token, loads role from DB, populates req.user)
      │
      ▼
authorizeRoles(...allowedRoles) Middleware (validates req.user.role)
      │
      ▼
Protected Controllers (e.g. UserController, IncidentController)
      │
      ▼
Domain Services (e.g. userService, incidentService)
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
- Role-based authorization

---

# 🧪 Quality Assurance

Every sprint undergoes:

- Functional testing
- Regression testing
- API testing using Postman
- JWT validation
- Role-based authorization verification
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
- Sprint 2.5 – Role-Based Authorization
- Sprint 3.1 – Incident Domain & Persistence Layer
- Sprint 3.2 – Create Incident API

## 🚧 In Progress

- Sprint 3.3 – Incident Retrieval APIs

## 📅 Planned

- Sprint 4 – File Uploads
- Sprint 5 – Interactive Maps
- Sprint 6 – Real-Time Tracking (Socket.IO)
- Sprint 7 – Dashboard & Analytics
- Sprint 8 – Production Deployment

---

# 📄 License

This project is licensed under the MIT License.

See the **LICENSE** file for details.
