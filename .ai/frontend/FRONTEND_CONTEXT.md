# Frontend AI Context & Guidelines

## 1. Frontend Stack

- **Framework**: React 18 (SPA) + Vite 6
- **Language**: TypeScript 5.7 (Strict Mode)
- **Styling**: Tailwind CSS 3.4 + Custom Design Tokens
- **State & Server Cache**: TanStack Query (React Query v5)
- **HTTP Client**: Axios with centralized response interceptors
- **Real-time Client**: Socket.IO Client singleton (`socket.client.ts`)
- **Icons & UI**: Lucide React + Tailwind glassmorphism

---

## 2. Directory Layout

```
client/src/
├── assets/          # Static media (icons, logos)
├── components/      # Shared layout and primitive UI components
│   ├── ui/          # Generic reusable primitives (Button, Card, Badge, etc.)
│   ├── Navbar.tsx   # Top navigation header
│   └── Footer.tsx   # Global footer
├── features/        # Feature-sliced modules (health, and future modules)
│   └── [feature]/   # components/, hooks/, services/
├── layouts/         # Page wrappers (AppLayout.tsx)
├── pages/           # Route views (HomePage, NotFoundPage)
├── routes/          # React Router route tree
├── services/        # Singleton infrastructure clients (api.client.ts, socket.client.ts)
├── styles/          # Global CSS and Tailwind directives
├── types/           # Global TypeScript type definitions
└── utils/           # Helper functions (cn, formatters)
```

---

## 3. Best Practices

1. **Feature-First Architecture**: Group code by business feature rather than technical type.
2. **Server State vs Client State**: Use TanStack Query for all server-originating data. Keep local UI state in standard React hooks (`useState`, `useReducer`).
3. **No Direct Axios In Components**: Components must always consume feature hooks or feature API service functions.
