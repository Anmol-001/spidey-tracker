# Changelog

All notable changes to this project will be documented in this file.

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
