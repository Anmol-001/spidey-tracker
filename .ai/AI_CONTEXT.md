# Spidey Tracker — Master AI Context & Engineering Mandates

## 1. Project Overview & Multi-Week Vision

**Spidey Tracker** is a production-grade full-stack MERN application designed as an incident and sighting tracking platform.
While the frontend interface is themed around a Spider-Man tactical telemetry network, the backend architecture MUST remain completely domain-agnostic.

### The Backend Invariant

The backend core handles generalized tracking concepts:

- Entities (signals, incidents, sightings, alerts)
- Geolocation (latitude, longitude, accuracy, radius)
- Timestamps, tags, metadata, and media attachments
- Verification states (unverified, verified, resolving, dismissed)
- Real-time subscriber streams and notification dispatchers

This ensures the backend core can be white-labeled into:

- **Spidey Tracker** (Spider-Man sighting network)
- **SignalScout** (Generic signal monitoring)
- **Disaster Tracker** (Civil protection incident mapping)
- **Wildlife Tracker** (Ecological observation log)
- **Lost Pet Tracker** (Community recovery system)
- **Emergency Response Tracker** (First-responder dispatch feeds)

---

## 2. Core Architectural Principles

- **Clean Layered Architecture**: Strict unidirectional flow: `Route` -> `Controller` -> `Service` -> `Database/Gateway`.
- **SOLID Design**: Single responsibility per module, explicit interfaces for all service contracts.
- **Strict Type Safety**: End-to-end TypeScript 5.7 strict mode. Never use `any`. Use `unknown` with narrowing or generics.
- **Zero Technical Debt**: No temporary shortcuts, hacks, or tutorial patterns. Treat as high-scale production software.

---

## 3. Directory Topology

```
.ai/
├── AI_CONTEXT.md
├── frontend/
│   ├── FRONTEND_CONTEXT.md
│   ├── COMPONENT_RULES.md
│   └── UI_DESIGN_SYSTEM.md
├── backend/
│   ├── BACKEND_CONTEXT.md
│   ├── API_STANDARDS.md
│   ├── DATABASE_RULES.md
│   ├── SECURITY_GUIDELINES.md
│   └── SOCKET_EVENTS.md
├── prompts/
└── reviews/
    ├── code-review-checklist.md
    └── definition-of-done.md
```
