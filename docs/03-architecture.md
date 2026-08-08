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
