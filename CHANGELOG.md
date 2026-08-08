# Changelog

All notable changes to this project will be documented in this file.

## [2.5.0] - 2026-08-08 (Sprint 2.5 Role-Based Authorization)

### Added

- Reusable role-based authorization middleware.
- Authorization based on user roles.
- Role-aware authenticated request context.
- Support for protecting routes using authorizeRoles(...allowedRoles).

### Changed

- Authentication middleware now attaches the authenticated user's role to req.user.
- Authorization is separated cleanly from authentication.

### Verified

- Unauthorized requests return 401.
- Authenticated users without required permissions return 403.
- Authorized users access protected resources successfully.
- TypeScript, ESLint, Prettier, build and Postman QA all passed.

---

## [2.4.0] - 2026-08-08 (Sprint 2.4 Current User Profile)

### Added

- Dedicated User module (`server/src/modules/user/`) for user profile operations.
- User service (`user.service.ts`) with `getProfile` method retrieving user profiles by ID via lean MongoDB queries.
- User controller (`user.controller.ts`) with `getCurrentUser` transport handler.
- User router (`user.route.ts`) mounting `GET /me` protected by `authenticateUser` middleware.
- Protected endpoint `GET /api/v1/users/me` returning sanitized user profiles.
- User profile response DTO (`UserResponseDto`) with explicit exclusions for `passwordHash`, `__v`, and raw `_id`.

### Changed

- Mounted `userRouter` under `/users` in the versioned API router (`/api/v1/users`).
- Decoupled user profile management from authentication endpoints.

### Verified

- `GET /api/v1/users/me` without Bearer token correctly returns `401 Unauthorized`.
- `GET /api/v1/users/me` with invalid or expired token correctly returns `401 Unauthorized`.
- `GET /api/v1/users/me` with valid Bearer token returns `200 OK` with sanitized user profile.
- Registration, login, `/auth/me`, and health endpoint regression tests passed.
- Strict TypeScript compilation (`type-check`), ESLint, and Prettier quality gates passed.

---

## [2.3.0] - 2026-08-07 (Sprint 2.3 Authentication Middleware)

### Added

- JWT authentication middleware (`authenticateUser`) for protecting secured API routes.
- Global Express Request type augmentation (`req.user`) using TypeScript declaration merging.
- Protected endpoint `GET /api/v1/auth/me` to return the authenticated user's identity.
- Automatic Bearer token authentication support for all future protected endpoints.
- Postman environment workflow for automatic JWT storage and reuse during API testing.

### Changed

- Centralized authentication logic into reusable middleware.
- Protected routes now rely on middleware instead of performing authentication inside controllers.
- Standardized authentication failures to return consistent `401 Unauthorized` responses without leaking implementation details.

### Verified

- Valid JWT successfully authenticates protected requests.
- Missing, malformed, expired, and invalid JWTs correctly return `401 Unauthorized`.
- Authenticated requests populate `req.user` with the minimal user identity.
- Registration, login, and health endpoint regression tests passed.
- TypeScript, ESLint, and Prettier quality gates passed.

---

## [2.2.0] - 2026-08-06 (Sprint 2.2 User Login & JWT Authentication)

### Added

- User login endpoint (`POST /api/v1/auth/login`) with secure email/password authentication.
- JWT access token generation using `jsonwebtoken` with HS256 signing.
- Shared JWT utility (`jwt.util.ts`) for centralized token generation and verification.
- Login request validation using Zod schemas.
- Environment-based JWT configuration (`JWT_ACCESS_SECRET` and `JWT_ACCESS_EXPIRES_IN`).
- Secure password verification using `bcryptjs.compare()`.

### Changed

- Extended the authentication module to support secure user login.
- Centralized JWT configuration within the shared application configuration.
- Standardized authentication responses using the existing API response envelope.

### Security

- Password hashes remain excluded from all API responses.
- JWT payload limited to minimal identity claims (`sub` and `email`).
- Uniform `401 Unauthorized` responses prevent user enumeration attacks.
- JWT secret and expiration are fully environment-driven.

### Verified

- Successful login with valid credentials.
- Invalid password handling.
- Unknown email handling.
- Login validation for malformed requests.
- JWT payload inspection and verification.
- Registration regression tests passed.
- Health endpoint regression tests passed.
- TypeScript, ESLint, and Prettier quality gates passed.

---

## [2.1.0] - 2026-08-04 (Sprint 2.1 User Registration)

### Added

- Feature-based authentication module (`server/src/modules/auth/`).
- User registration endpoint (`POST /api/v1/auth/register`).
- Registration request validation using Zod schemas.
- Password hashing using `bcryptjs` with 12 salt rounds.
- Duplicate email detection with HTTP `409 Conflict`.
- Duplicate username detection with HTTP `409 Conflict`.
- Structured authentication service, controller, validation, and routing layers.
- Standardized authentication API responses following the project's response envelope.
- Registration integrated into the versioned API router (`/api/v1/auth/register`).

### Changed

- Updated project README to reflect Sprint 2.1 functionality and current API surface.
- Improved backend feature organization following the approved feature-based architecture.
- Removed unnecessary Health module barrel exports in favor of direct module imports.
- Preserved original username casing while continuing to normalize email addresses.
- Refined authentication flow to maintain strict separation between validation, controller, service, and persistence layers.

### Fixed

- Resolved username casing issue during registration.
- Corrected authentication route integration.
- Improved registration validation flow.
- Verified secure password persistence using bcrypt hashing.
- Eliminated architecture inconsistencies discovered during Sprint 2.1 code review.

### Verified

- Successful user registration.
- Duplicate email validation.
- Duplicate username validation.
- Password complexity validation.
- Invalid email validation.
- Required field validation.
- Password hashing verification.
- MongoDB persistence.
- Health endpoints (`GET /health` and `GET /api/v1/health`).
- End-to-end registration workflow validated through Postman.

---

## [1.1.0] - 2026-08-03 (Sprint 1.1 Architectural Refinement & Cleanup)

### Changed

- Documentation restructured into a standardized hierarchy (`01-prd.md`, `02-srs.md`, `03-architecture.md`, `04-database.md`, `05-api.md`, `06-roadmap.md`, `07-testing.md`).
- AI guidance reorganized into domain-specific directories (`frontend/`, `backend/`, `prompts/`, `reviews/`).
- Design directory organized into `wireframes/`, `mockups/`, `logos/`, and `assets/`.
- Added GitHub governance templates including issue templates and pull request template.

### Removed

- Removed out-of-scope future sprint artifacts (`docker-compose.yml`, `docker-compose.dev.yml`, `server/Dockerfile`, `client/Dockerfile`, `.github/workflows/ci.yml`).
- Removed legacy `.eslintrc.cjs` configuration in favor of the root `eslint.config.mjs`.

---

## [1.0.0] - 2026-08-03 (Sprint 1 Foundation)

### Added

- Monorepo initialized using npm workspaces for client and server packages.
- Shared strict TypeScript 5.7 configuration (`tsconfig.base.json`).
- ESLint 9 and Prettier configuration with Husky and lint-staged pre-commit hooks.
- Domain-agnostic Express backend with centralized configuration, structured logging, resilient MongoDB connection manager, and global error handling.
- Operational health endpoints (`GET /health` and `GET /api/v1/health`).
- React 18 + Vite + Tailwind CSS frontend with cyberpunk-inspired dashboard foundation.
- Shared utilities and project-wide coding standards established.
