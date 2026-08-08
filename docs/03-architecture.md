# Clean Architecture & System Design

## 1. Monorepo Organization

```
spidey-tracker/
├── package.json              # Monorepo workspace configuration
├── tsconfig.base.json        # Shared base TypeScript options
├── eslint.config.mjs         # Monorepo ESLint 9 configuration
├── .prettierrc               # Shared code formatter configuration
├── .ai/                      # AI assistant context and rules
├── docs/                     # Comprehensive technical documentation
├── design/                   # UI mockups, assets, and design system
├── server/                   # Domain-agnostic Express backend
│   ├── src/
│   │   ├── modules/          # Feature-based domain modules
│   │   │   ├── auth/         # Authentication module (controller, service, routes, validation, types)
│   │   │   ├── health/       # Health telemetry module (controller, service, routes, types)
│   │   │   ├── incident/     # Incident module (constants, types, model, dto, validation, service, controller, route)
│   │   │   └── user/         # User profile module (controller, service, routes, model, types, validation)
│   │   ├── shared/           # Cross-cutting infrastructure & utilities
│   │   │   ├── config/       # Zod config, logger, database manager
│   │   │   ├── middleware/   # Error handling, validation, auth (authenticateUser), RBAC (authorizeRoles), notFound
│   │   │   ├── socket/       # Real-time WebSocket gateway
│   │   │   ├── types/        # Global API contracts & express user augmentation (req.user with role)
│   │   │   └── utils/        # ApiError, ApiResponse, JWT utilities
│   │   ├── routes/           # Versioned API route aggregators (/api/v1)
│   │   ├── app.ts            # Express app assembly
│   │   └── server.ts         # Server bootstrapper & lifecycle
│   ├── package.json
│   └── tsconfig.json
└── client/                   # Spider-Man themed React + Vite frontend
    ├── src/
    │   ├── components/       # Primitive UI components & Layouts
    │   ├── features/         # Feature-sliced modules (health, sightings)
    │   ├── pages/            # View pages (HomePage, NotFoundPage)
    │   ├── routes/           # React Router tree
    │   ├── services/         # Axios & Socket.IO clients
    │   ├── styles/           # Tailwind CSS directives
    │   ├── types/            # Client TypeScript interfaces
    │   └── utils/            # Utility helpers
    ├── package.json
    ├── tailwind.config.ts
    └── vite.config.ts
```

---

## 2. Unidirectional Data Flow & Request Pipeline

```
[Client SPA] ──(HTTP/WS)──> [Express App] ──> [authenticateUser] ──> [authorizeRoles]
                                                                            │
                                                                            ▼
                                                                     [Route Handler]
                                                                            │
                                                                            ▼
                                                                      [Controller]
                                                                            │
                                                                            ▼
                                                                        [Service]
                                                                            │
                                                                            ▼
                                                                   [Database / Mongoose]
```

---

## 3. Separation of Authentication vs. Authorization

| Layer              | Component                         | Responsibility                                                                                                                        | Failure Response   |
| :----------------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :----------------- |
| **Authentication** | `authenticateUser`                | Verifies identity via JWT Bearer token and attaches database-verified user profile (`id`, `username`, `email`, `role`) to `req.user`. | `401 Unauthorized` |
| **Authorization**  | `authorizeRoles(...allowedRoles)` | Inspects `req.user.role` against permissible roles for the requested endpoint. Zero database lookups; purely policy enforcement.      | `403 Forbidden`    |

---

## 4. Protected Request Flow (Authentication & Authorization)

```text
[Client Request: HTTP Method + Path]
                │
                │ (Headers: Authorization: Bearer <JWT>)
                ▼
[authenticateUser Middleware]
                │
                ├── If missing / invalid / expired token ──► HTTP 401 Unauthorized
                │
                └── If valid token ──► Queries DB & populates req.user ({ id, username, email, role })
                                              │
                                              ▼
                                 [authorizeRoles(...allowedRoles) Middleware]
                                              │
                                              ├── If req.user.role NOT in allowedRoles ──► HTTP 403 Forbidden
                                              │
                                              └── If authorized (or route is unrestricted)
                                                            │
                                                            ▼
                                               [Domain Router (e.g. user.route.ts)]
                                                            │
                                                            ▼
                                               [Controller (e.g. user.controller.ts)]
                                                            │
                                                            ▼
                                               [Service Layer (e.g. user.service.ts)]
                                                            │
                                                            ▼
                                               [MongoDB Database (Mongoose)]
                                                            │
                                                            ▼
                                               [Sanitized Response DTO]
                                                            │
                                                            ▼
                                               [HTTP 200/201 Success Response Envelope]
```

---

## 5. Incident Module Architecture & Create Incident Flow

### 5.1 Request Pipeline

```text
Client
  │
  ▼ (POST /api/v1/incidents with Bearer Token + Body)
authenticateUser Middleware
  │ (Validates JWT & populates req.user)
  ▼
validateRequest(createIncidentSchema)
  │ (Strict Zod validation; rejects extra/unauthorized properties)
  ▼
IncidentController (createIncident)
  │ (Extracts req.body and req.user.id; calls incidentService)
  ▼
IncidentService (createIncident)
  │ (Applies server defaults: status = OPEN, severity = MEDIUM, assignedTo = null, createdBy = userId)
  ▼
Incident Model (Mongoose)
  │ (Validates schema constraints & writes to MongoDB)
  ▼
MongoDB
  │
  ▼
Sanitized IncidentResponseDto
  │
  ▼
HTTP 201 Created (ApiResponse Envelope)
```

### 5.2 Separation of Responsibilities

| Layer           | Component                                         | Responsibility                                                                                                                                                                                        |
| :-------------- | :------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Validation**  | `incident.validation.ts` (`createIncidentSchema`) | Validates payload boundaries using Zod with `.strict()`. Rejects unknown/forbidden fields (`status`, `severity`, `createdBy`, `assignedTo`).                                                          |
| **Controller**  | `incident.controller.ts` (`IncidentController`)   | Thin HTTP transport layer. Extracts request data, invokes `IncidentService`, formats response via `successResponse(res, 201, ...)`, and passes errors to `next(error)`. Contains zero business logic. |
| **Service**     | `incident.service.ts` (`IncidentService`)         | Pure domain business logic. Completely independent of Express. Applies backend-controlled defaults, manages persistence transformations, and maps documents to `IncidentResponseDto`.                 |
| **Persistence** | `incident.model.ts` (`Incident`)                  | Mongoose persistence layer with schema constraints, enum restrictions, timestamps, and database indexing.                                                                                             |

### 5.3 Approved Business Rules & Ownership

Clients reporting incidents **cannot** supply:

- `status`
- `severity`
- `createdBy`
- `assignedTo`

These fields are strictly managed and assigned by the backend:

- `createdBy` = `req.user.id` (derived from authenticated session)
- `status` = `INCIDENT_STATUS.OPEN` (`"open"`)
- `severity` = `INCIDENT_SEVERITY.MEDIUM` (`"medium"`)
- `assignedTo` = `null`
