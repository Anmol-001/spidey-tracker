# UI Component Development Rules

## 1. Component Design Standards

- **Explicit Prop Types**: Every component must declare an `interface [ComponentName]Props`.
- **Pure Functions**: Favor functional components with React hooks. Avoid class components.
- **Children Propagation**: Extend `React.HTMLAttributes<T>` or `React.ButtonHTMLAttributes<T>` when creating primitive UI elements.
- **Styling Utility**: Always merge classes via `cn(...)` (`clsx` + `tailwind-merge`).

## 2. Accessibility & Semantics

- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Include `aria-label` or visible text for screen readers on icon buttons.
- Ensure all interactive elements support keyboard navigation (`Tab`, `Enter`, `Space`).

## 3. Separation of Concerns

- **Presentational Components** (`components/ui/*`): Contain zero network or global business logic. Pure visual renderers.
- **Smart / Feature Components** (`features/[feature]/components/*`): Connect to hooks, manage user interaction flows, and delegate UI rendering to primitives.
