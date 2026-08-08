# Database Design & MongoDB Architecture

## 1. Connection Architecture

The MongoDB connection is encapsulated inside `server/src/config/database.ts`:

- **Resilience**: Standalone server startup supported if database is unreachable.
- **Connection Events**: Explicit logging for `connected`, `error`, and `disconnected` events.
- **Graceful Shutdown**: Automatic disconnection upon `SIGINT` or `SIGTERM`.

---

## 2. Entity Data Models

### User Entity (Sprint 2)

```typescript
interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: 'citizen' | 'responder' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Incident Entity (Sprint 3.1 & 3.2)

```typescript
interface IIncident {
  title: string;
  description: string;
  category: 'crime' | 'accident' | 'sighting' | 'hazard' | 'other';
  latitude: number;
  longitude: number;
  address?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
```
