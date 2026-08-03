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
