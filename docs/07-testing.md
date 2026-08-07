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

### 3.1 Sprint 2.4 — User Profile Module Verification

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
