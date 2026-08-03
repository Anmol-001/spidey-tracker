# Changelog

All notable changes to the **Spidey Tracker** monorepo are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-08-03 (Sprint 1.1 Architectural Refinement & Cleanup)

### Changed

- **Documentation Restructuring**: Organized `docs/` into standardized hierarchy (`01-prd.md`, `02-srs.md`, `03-architecture.md`, `04-database.md`, `05-api.md`, `06-roadmap.md`, `07-testing.md`).
- **AI Guidelines Segregation**: Reorganized `.ai/` into domain-specific subdirectories (`frontend/`, `backend/`, `prompts/`, `reviews/`).
- **Design Directory Hierarchy**: Organized `design/` into `wireframes/`, `mockups/`, `logos/`, and `assets/`.
- **GitHub Governance**: Added `.github/ISSUE_TEMPLATE/` (`bug_report.md`, `feature_request.md`) and `.github/PULL_REQUEST_TEMPLATE.md`.

### Removed

- Removed out-of-scope future sprint artifacts (`docker-compose.yml`, `docker-compose.dev.yml`, `server/Dockerfile`, `client/Dockerfile`, `.github/workflows/ci.yml`).
- Removed legacy `.eslintrc.cjs` configuration in favor of root `eslint.config.mjs`.

---

## [1.0.0] - 2026-08-03 (Sprint 1 Foundation)

### Added

- Monorepo initialized with npm workspaces for `server` and `client`.
- Shared strict TypeScript 5.7 configuration (`tsconfig.base.json`).
- ESLint 9 and Prettier configuration with pre-commit hooks via Husky and `lint-staged`.
- Domain-agnostic Express backend in `server/` with Zod config parsing, structured logging, resilient MongoDB connection manager, and centralized error handling.
- Operational health check endpoints (`GET /health` and `GET /api/v1/health`).
- Cyberpunk telemetry frontend in `client/` built with React 18, Vite 6, Tailwind CSS, TanStack Query, and Lucide React.
