# WebSocket & Real-Time Event Architecture

## 1. Gateway Lifecycle

- Socket.IO gateway initialized via `src/socket/socket.server.ts`.
- Supports CORS with credentials and reconnection backoff.

## 2. Event Taxonomy (Future Sprints)

All WebSocket events must follow strict `[domain]:[action]` naming:

- `sighting:created`: Broadcasted when a new sighting/incident is reported.
- `sighting:updated`: Broadcasted on verification or status change.
- `telemetry:ping`: Heartbeat probe for live client telemetry.
- `incident:resolved`: Broadcasted when an incident is marked resolved.
