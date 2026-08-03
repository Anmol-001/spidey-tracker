# Backend Security Guidelines

## 1. HTTP Security Headers

- Helmet middleware enabled with secure HTTP headers (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`).
- Secure CORS origin whitelisting matching `CORS_ORIGIN` environment variable.

## 2. Input Validation & Sanitization

- All request bodies and query parameters must be validated via Zod schemas before reaching controllers.
- Trim and sanitize string inputs to protect against XSS and injection attacks.

## 3. Secret Management

- Zero hardcoded secrets, API keys, or database credentials.
- All secrets must be loaded via `.env` and validated at startup by Zod in `src/config/config.ts`.
