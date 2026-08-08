# Testing Strategy & Quality Assurance

## 1. Test Pyramid Strategy (Planned for Sprint 7)

```
        / \
       /   \        E2E Tests (Playwright)
      /─────\       - Critical user journeys
     /       \      Integration Tests (Supertest)
    /─────────\     - HTTP routes & DB interactions
   /           \    Unit Tests (Vitest)
  /─────────────\   - Services, utils, validators
```

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
