# Backend AI Context & Architecture Rules

## 1. Domain-Agnostic Core Mandate

The backend architecture is strictly decoupled from Spider-Man branding. All models, routes, services, and event channels use generalized terminology:

- `entities`, `incidents`, `sightings`, `signals`, `telemetry`
- `coordinates`, `location`, `timestamp`, `metadata`
- `verificationStatus`, `priority`, `resolution`

---

## 2. Layered Clean Architecture Flow

```
HTTP Request / WebSocket Event
       │
       ▼
 ┌───────────────┐
 │   Router      │ -> Express route definitions, schema validation middleware
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │  Controller   │ -> Extracts params/body, delegates to service, sends ApiResponse
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │   Service     │ -> Implements business logic (interfaces defined in types)
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │ Database / GW │ -> Mongoose models, Socket.IO emitter
 └───────────────┘
```

---

## 3. Mandatory Backend Rules

- **TypeScript Strict Mode**: Zero `any`. Always specify return types on functions and methods.
- **Environment Validation**: All environment variables must pass Zod schema in `src/config/config.ts`.
- **Structured Logging**: Always log through `src/config/logger.ts`, never raw `console.log`.
- **Operational Errors**: Always throw `ApiError(statusCode, message, errorCode, details)`.
