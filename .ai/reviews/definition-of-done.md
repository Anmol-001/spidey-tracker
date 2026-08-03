# Definition of Done (DoD)

A task or sprint milestone is marked **DONE** when:

1. **Implementation Completeness**: All functional requirements for the specific sprint scope are fully built.
2. **Typecheck & Linter Zero Tolerance**: `npm run type-check` and `npm run lint` report 0 errors and 0 warnings.
3. **Format Compliance**: `npm run format:check` reports 100% clean Prettier formatting.
4. **Build Verification**: `npm run build` succeeds cleanly for all monorepo workspaces.
5. **No Scope Creep**: No features, dependencies, or infrastructure files from future sprints are committed.
6. **Documentation Updated**: All relevant markdown files under `docs/` and `.ai/` accurately reflect the latest implementation.
