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
│   │   │   ├── middleware/   # Error handling, validation, auth middleware (authenticateUser), notFound
│   │   │   ├── socket/       # Real-time WebSocket gateway
│   │   │   ├── types/        # Global API contracts & express user augmentation
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

## 2. Unidirectional Data Flow

```
[Client SPA] ──(HTTP/WS)──> [Express App] ──> [Middleware Stack]
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

## 3. Authenticated User Profile Request Flow (Sprint 2.4)

```text
[Client Request: GET /api/v1/users/me]
                │
                │ (Headers: Authorization: Bearer <JWT>)
                ▼
[authenticateUser Middleware]
                │
                ├── If missing / invalid / expired token ──► HTTP 401 Unauthorized
                │
                └── If valid token ──► Populates req.user ({ id, email })
                                              │
                                              ▼
                                 [User Module Router (user.route.ts)]
                                              │
                                              ▼
                                 [User Controller (user.controller.ts)]
                                              │
                                              │ Calls userService.getProfile(req.user.id)
                                              ▼
                                 [User Service (user.service.ts)]
                                              │
                                              │ User.findById(userId).select(...).lean()
                                              ▼
                                 [MongoDB Database]
                                              │
                                              │ Returns user document
                                              ▼
                                 [Sanitized UserResponseDto]
                                              │
                                              │ Excludes passwordHash, __v, and raw _id
                                              ▼
                                 [HTTP 200 OK Response Envelope]
```
