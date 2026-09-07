# Testing Strategy & Quality Assurance

## 1. Automated Testing Architecture & Philosophy (Sprint 3.5)

Spidey Tracker follows an observable-behavior-first automated testing strategy built on top of **Vitest**, **Supertest**, and **MongoDB Memory Server**.

### 1.1 Testing Philosophy

- **Observable Behavior Over Implementation Details**: Tests validate external HTTP contracts, status codes, standardized error envelopes, and persistent database state rather than internal function calls or private implementations.
- **Zero Production Database Coupling**: Integration and unit tests run entirely against isolated in-memory MongoDB instances (`mongodb-memory-server`) or dedicated test databases, completely isolated from development and production databases.
- **Strict Environment Isolation**: Tests run with `NODE_ENV=test`, dedicated test JWT secrets, test port bindings, and suppress debug/info log noise (`LOG_LEVEL=error`).
- **No Mocking of Security Primitives**: Authentication flows (bcrypt hashing, JWT generation and verification, role-based authorization guards, active account checks) use real crypto operations and the real Mongoose User/Incident models rather than synthetic mocks.

---

### 1.2 Testing Stack

| Technology                | Version / Purpose                                                                         |
| :------------------------ | :---------------------------------------------------------------------------------------- |
| **Vitest**                | Next-generation fast test runner native to ESM/NodeNext and TypeScript                    |
| **Supertest**             | HTTP assertion library testing the Express application via ephemeral server binding       |
| **MongoDB Memory Server** | Ephemeral, in-memory MongoDB daemon providing isolated database instances per test worker |
| **@vitest/coverage-v8**   | Native V8 coverage instrumentation engine                                                 |

---

### 1.3 Test Directory Structure

```
server/
├── src/
├── tests/
│   ├── setup.ts                    # Global test environment configuration & lifecycle hooks
│   ├── helpers/
│   │   ├── db.helper.ts            # MongoMemoryServer lifecycle (start, clear, stop)
│   │   ├── auth.helper.ts          # Test user creation & JWT authentication helper
│   │   └── request.helper.ts       # Supertest binding against Express createApp()
│   ├── fixtures/
│   │   ├── user.fixture.ts         # User payload and attribute factories
│   │   └── incident.fixture.ts     # Incident payload factories
│   ├── unit/
│   │   ├── jwt.util.test.ts        # JWT token signing, verification & tampering unit tests
│   │   └── validate.test.ts        # Zod validation middleware unit tests
│   └── integration/
│       ├── auth/
│       │   ├── register.test.ts    # POST /api/v1/auth/register contract & conflict tests
│       │   ├── login.test.ts       # POST /api/v1/auth/login credentials & inactive user tests
│       │   └── auth-me.test.ts     # GET /api/v1/auth/me identity probe & token rejection tests
│       ├── user/
│       │   └── profile.test.ts     # GET /api/v1/users/me profile, sanitization & single-query tests
│       ├── incident/
│       │   ├── create.test.ts      # POST /api/v1/incidents creation, defaults & invariant guards
│       │   ├── list.test.ts        # GET /api/v1/incidents pagination, filtering & ordering tests
│       │   └── detail.test.ts      # GET /api/v1/incidents/:id detail retrieval, 404 & 400 tests
│       └── security/
│           └── security.test.ts    # Auth rate limiting, 413 payload cap, health bypass, RBAC tests
│
└── vitest.config.ts                # Server Vitest configuration
```

---

### 1.4 Test Execution & Commands

All commands can be run from the repository root or within the `server` workspace:

| Scope      | Command                                    | Description                                             |
| :--------- | :----------------------------------------- | :------------------------------------------------------ |
| **Root**   | `npm test`                                 | Runs the server test suite with Vitest in run mode      |
| **Root**   | `npm run test:watch`                       | Runs the server test suite in interactive watch mode    |
| **Root**   | `npm run test:coverage`                    | Runs the server test suite with V8 code coverage report |
| **Server** | `npm test --workspace=server`              | Runs tests directly within server workspace             |
| **Server** | `npm run test:watch --workspace=server`    | Runs watch mode within server workspace                 |
| **Server** | `npm run test:coverage --workspace=server` | Runs coverage report within server workspace            |

---

### 1.5 Database Lifecycle & Isolation Strategy

1. **Global Before All**: The test runner initializes `MongoMemoryServer` (or connects to `MONGODB_URI_TEST` if explicitly supplied) and establishes a Mongoose connection.
2. **Per-Test Cleanup (`beforeEach`)**: Every test begins with a clean slate; collections are cleared via `deleteMany({})` to prevent test-ordering state pollution.
3. **Global After All**: Mongoose disconnects cleanly, and the ephemeral `MongoMemoryServer` instance is stopped.
4. **Safety Guarantee**: If neither an in-memory server nor an explicit test URI is available, the setup aborts immediately with a clear configuration error. Production database URIs are never connected to during test execution.

---

### 1.6 Rate Limiter & Security Testing Considerations

- **Layered Rate Limiting**: The production backend intentionally implements dual-layer rate limiting: an API-level limiter (`/api/v1/*`, 100 req/15min) and an Auth-specific limiter (`/api/v1/auth/*`, 10 req/1min).
- **Test Isolation**: Rate limit testing runs in dedicated isolated integration suites. General endpoint suites execute with standard test volume well under threshold limits.
- **Health Endpoint Exemption**: `/health` explicitly bypasses the API rate limiter to guarantee monitoring probes are never throttled.
- **1MB Payload Enforcement**: Body parsers reject requests exceeding 1MB with `413 Payload Too Large` and standard error envelope `PAYLOAD_TOO_LARGE`.

---

### 1.7 CI/CD Readiness

The test infrastructure is fully headless and deterministic:

- Zero external dependencies or network requirements (uses embedded in-memory MongoDB binary).
- Runs across all Node 20+ environments (Linux, macOS, Windows).
- Clean exit codes compatible with GitHub Actions or other CI pipelines (`vitest run` exits `0` on pass, `1` on failure).

---

## 2. Quality Gates & Verification Rules

- **Type-Check Gate**: `tsc --noEmit` must pass with 0 errors before any commit or PR merge.
- **Linter Gate**: ESLint 9 must report 0 errors and 0 warnings.
- **Code Style Gate**: Prettier must verify all source files without formatting deviations.

---

## 3. Sprint Verification Logs

### 3.1 Sprint 3.2 — Create Incident API Verification

| Category                | Test Scenario                | Request / Input                                             | Expected Result                                               |  Status   |
| :---------------------- | :--------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------ | :-------: |
| **Positive Flow**       | Successful Incident Creation | `POST /api/v1/incidents` with valid payload & Bearer token  | `201 Created` with full `IncidentResponseDto` envelope        | ✅ Passed |
| **Authentication Gate** | Missing Authorization Header | `POST /api/v1/incidents` without Bearer token               | `401 Unauthorized` (`UNAUTHORIZED`)                           | ✅ Passed |
| **Authentication Gate** | Invalid / Expired JWT        | `POST /api/v1/incidents` with malformed Bearer token        | `401 Unauthorized` (`UNAUTHORIZED`)                           | ✅ Passed |
| **Validation Gate**     | Missing Required Fields      | `POST /api/v1/incidents` with empty body or missing fields  | `400 Bad Request` (`VALIDATION_ERROR`)                        | ✅ Passed |
| **Validation Gate**     | Invalid Incident Category    | `POST /api/v1/incidents` with category not in enum          | `400 Bad Request` (`VALIDATION_ERROR`)                        | ✅ Passed |
| **Validation Gate**     | Out-of-Bounds Coordinates    | `POST /api/v1/incidents` with lat > 90 or lng > 180         | `400 Bad Request` (`VALIDATION_ERROR`)                        | ✅ Passed |
| **Validation Gate**     | Unknown Properties Rejected  | `POST /api/v1/incidents` sending `status` or `severity`     | `400 Bad Request` (`VALIDATION_ERROR`) due to `.strict()`     | ✅ Passed |
| **Business Rule**       | Automated `createdBy`        | Verified against authenticated `req.user.id`                | `createdBy` matches token user ObjectId                       | ✅ Passed |
| **Business Rule**       | Default `status`             | Verified on returned DTO and DB record                      | `status` equals `"open"` (`INCIDENT_STATUS.OPEN`)             | ✅ Passed |
| **Business Rule**       | Default `severity`           | Verified on returned DTO and DB record                      | `severity` equals `"medium"` (`INCIDENT_SEVERITY.MEDIUM`)     | ✅ Passed |
| **Business Rule**       | Default `assignedTo`         | Verified on returned DTO and DB record                      | `assignedTo` equals `null`                                    | ✅ Passed |
| **Persistence**         | MongoDB Storage              | Database query check for created document                   | Document saved with correct fields, schema types & timestamps | ✅ Passed |
| **Regression**          | Existing Modules             | Health, Auth (`register`, `login`, `me`), User (`users/me`) | All endpoints functioning normally with zero regressions      | ✅ Passed |
| **Static Quality Gate** | Strict Type-Checking         | `npm run type-check --workspace=server`                     | 0 TypeScript compilation errors                               | ✅ Passed |
| **Static Quality Gate** | Linting Standards            | `npm run lint --workspace=server`                           | 0 ESLint errors and 0 warnings                                | ✅ Passed |
| **Static Quality Gate** | Code Formatting              | `npx prettier --check` across workspace                     | 100% compliant code style                                     | ✅ Passed |
| **Build Gate**          | Monorepo Server Build        | `npm run build --workspace=server`                          | Clean production build                                        | ✅ Passed |

---

### 3.2 Sprint 2.5 — Role-Based Authorization Verification

| Category                 | Test Scenario                 | Request / Input                                                 | Expected Result                     |  Status   |
| :----------------------- | :---------------------------- | :-------------------------------------------------------------- | :---------------------------------- | :-------: |
| **Authentication Gate**  | Missing Authorization Token   | Protected route without `Authorization` header                  | `401 Unauthorized` (`UNAUTHORIZED`) | ✅ Passed |
| **Authentication Gate**  | Invalid / Expired JWT         | Protected route with malformed Bearer token                     | `401 Unauthorized` (`UNAUTHORIZED`) | ✅ Passed |
| **Role Authorization**   | Insufficient Role Permission  | Protected route with role not in `allowedRoles`                 | `403 Forbidden` (`FORBIDDEN`)       | ✅ Passed |
| **Role Authorization**   | Authorized Role Match         | Protected route with matching allowed role                      | `200 OK` / Successful action        | ✅ Passed |
| **Context Augmentation** | Role Attachment in `req.user` | Verified DB role projected directly on request                  | `req.user.role` populated correctly | ✅ Passed |
| **Regression**           | User Profile Endpoint         | `GET /api/v1/users/me` with valid citizen/responder/admin token | `200 OK` with `UserResponseDto`     | ✅ Passed |
| **Regression**           | Registration & Login          | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`         | `201 Created` & `200 OK`            | ✅ Passed |
| **Regression**           | Operational Health            | `GET /health`, `GET /api/v1/health`                             | `200 OK` (`{"status": "ok"}`)       | ✅ Passed |
| **Static Quality Gate**  | Strict Type-Checking          | `npm run type-check --workspace=server`                         | 0 TypeScript compilation errors     | ✅ Passed |
| **Static Quality Gate**  | Linting Standards             | `npm run lint --workspace=server`                               | 0 ESLint errors and 0 warnings      | ✅ Passed |
| **Static Quality Gate**  | Code Formatting               | `npx prettier --check` across workspace                         | 100% compliant code style           | ✅ Passed |
| **Build Gate**           | Monorepo Build                | `npm run build`                                                 | Clean production build              | ✅ Passed |

---

### 3.3 Sprint 2.4 — User Profile Module Verification

| Category                | Test Scenario          | Request / Input                                                    | Expected Result                                        |  Status   |
| :---------------------- | :--------------------- | :----------------------------------------------------------------- | :----------------------------------------------------- | :-------: |
| **Authentication**      | Missing Bearer Token   | `GET /api/v1/users/me` (No Auth Header)                            | `401 Unauthorized` (`UNAUTHORIZED`)                    | ✅ Passed |
| **Authentication**      | Invalid Format Header  | `GET /api/v1/users/me` (`Authorization: Basic xyz`)                | `401 Unauthorized` (`UNAUTHORIZED`)                    | ✅ Passed |
| **Authentication**      | Expired / Tampered JWT | `GET /api/v1/users/me` (`Authorization: Bearer invalid.token.str`) | `401 Unauthorized` (`UNAUTHORIZED`)                    | ✅ Passed |
| **Profile Retrieval**   | Valid JWT Token        | `GET /api/v1/users/me` (`Authorization: Bearer <valid_jwt>`)       | `200 OK` with full `UserResponseDto`                   | ✅ Passed |
| **Data Sanitization**   | Response DTO Audit     | Inspect returned `data` object                                     | `passwordHash`, `__v`, and `_id` excluded; `id` mapped | ✅ Passed |
| **Regression**          | Health Endpoints       | `GET /health`, `GET /api/v1/health`                                | `200 OK` (`{"status": "ok"}`)                          | ✅ Passed |
| **Regression**          | User Registration      | `POST /api/v1/auth/register`                                       | `201 Created` with sanitized user payload              | ✅ Passed |
| **Regression**          | User Login             | `POST /api/v1/auth/login`                                          | `200 OK` with valid signed `accessToken`               | ✅ Passed |
| **Regression**          | Auth Probe             | `GET /api/v1/auth/me`                                              | `200 OK` with `{ id, email }` identity payload         | ✅ Passed |
| **Static Quality Gate** | Strict Type-Checking   | `npm run type-check --workspace=server`                            | 0 TypeScript compilation errors                        | ✅ Passed |
| **Static Quality Gate** | Linting Rules          | `npm run lint --workspace=server`                                  | 0 ESLint errors and 0 warnings                         | ✅ Passed |
| **Static Quality Gate** | Prettier Formatting    | `npx prettier --check` across modified and new files               | 100% compliant with Prettier code style                | ✅ Passed |
