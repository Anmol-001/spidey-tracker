# Software Requirements Specification (SRS)

## 1. System Architecture & Constraints

- **Platform Architecture**: Monorepo using npm workspaces (`@spidey-tracker/server`, `@spidey-tracker/client`).
- **Runtime**: Node.js >= 18, Express 4.x, React 18, Vite 6.
- **Database**: MongoDB 7.x with Mongoose ODM.
- **Communication Protocols**: HTTP/1.1 REST JSON API + WebSocket (Socket.IO).

---

## 2. Functional Requirements (Current & Planned)

### FR-1: Health & Telemetry Probing (Sprint 1)

- The system must provide root `/health` and versioned `/api/v1/health` endpoints.
- Response must include JSON payload: `{ success: true, message: "...", data: { status: "ok" } }`.

### FR-2: User Authentication & Roles (Sprint 2)

- Register and login with hashed passwords (bcrypt).
- Issue stateless JWTs and refresh tokens with secure HTTP-only cookies.

### FR-3: Sighting & Incident Management (Sprint 3)

- Create, read, update, and delete sighting documents with geolocation coordinates (`latitude`, `longitude`).

### FR-4: Geospatial Queries & Map Visualization (Sprint 4)

- Query incidents within bounding box or radial proximity ($near, $geoWithin).

### FR-5: Real-Time Event Dispatch (Sprint 5)

- Emit WebSocket events on incident creation/updates to connected clients.

---

## 3. Non-Functional Requirements

- **Performance**: API p95 response time < 50ms for telemetry probes.
- **Type Safety**: 100% strict TypeScript compilation with zero `any` usage.
- **Maintainability**: Clear separation into Clean Architecture layers.
