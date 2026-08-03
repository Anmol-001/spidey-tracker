# Database Architecture & Management Rules

## 1. Resilience & Connection Management

- Database operations must be managed through `src/config/database.ts`.
- The server must support standalone startup with automated retry intervals if MongoDB is temporarily unreachable.
- Use explicit timeouts (`serverSelectionTimeoutMS: 5000`).

## 2. Schema Guidelines (Future Sprints)

- All Mongoose schemas must define typed interfaces extending `mongoose.Document`.
- Enable `{ timestamps: true }` on all document schemas.
- Index all query-critical fields (e.g., coordinates with `2dsphere` indexes, status flags, timestamps).
- Always sanitize query parameters to prevent NoSQL query injection.
