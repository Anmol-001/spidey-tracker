# Contributing Guidelines

Thank you for contributing to **Spidey Tracker**! To ensure top-tier engineering velocity and code quality, please adhere to the following standards.

---

## 🏛️ Monorepo Workflow

1. Fork the repo and create a feature branch: `git checkout -b feature/your-feature-name`.
2. Follow strict TypeScript conventions:
   - No `any` types allowed.
   - Strict mode enabled.
   - All API endpoints must return standardized response envelopes.
3. Write clean, self-documenting code with layered architecture:
   - **Controllers**: Handle HTTP serialization, status codes, and input/output mapping.
   - **Services**: Contain all domain and business logic.
   - **Data Layer / Models**: Database schema and persistence interactions.
4. Run validation checks before opening PR:
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   npm run build
   ```
5. Commit messages must adhere to [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(client): add map view clustering`
   - `fix(server): resolve connection retry timeout`
   - `docs: update API documentation`

---

## 🛡️ Code Review Criteria

- Architecture maintains generic backend decoupling (no Spider-Man domain logic in `server/`).
- No direct database access from Controllers.
- All environment variables are typed and validated.
- All files have zero lint warnings and zero TypeScript errors.
