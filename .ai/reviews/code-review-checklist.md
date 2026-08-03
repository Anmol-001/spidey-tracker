# Pull Request Code Review Checklist

Before approving or merging any PR into `main`, verify:

### 1. Architecture & Domain Separation

- [ ] Backend contains zero Spider-Man specific business logic or hardcoded terminology.
- [ ] Layered separation of concerns is maintained (`Routes` -> `Controllers` -> `Services`).
- [ ] No direct database queries or raw Mongoose operations inside controllers.

### 2. Type Safety & Quality

- [ ] `npm run type-check` passes with 0 errors.
- [ ] No usage of TypeScript `any`.
- [ ] Interfaces used for contracts, DTOs, and component prop definitions.
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npm run format:check` passes with 100% Prettier compliance.

### 3. API Contract & Error Handling

- [ ] All API responses follow the standard `ApiResponse<T>` envelope.
- [ ] Operational errors throw instances of `ApiError`.
- [ ] No uncaught promises; all async functions have error handling or propagate to global middleware.
