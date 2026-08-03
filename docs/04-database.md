# Database Design & MongoDB Architecture

## 1. Connection Architecture

The MongoDB connection is encapsulated inside `server/src/config/database.ts`:

- **Resilience**: Standalone server startup supported if database is unreachable.
- **Connection Events**: Explicit logging for `connected`, `error`, and `disconnected` events.
- **Graceful Shutdown**: Automatic disconnection upon `SIGINT` or `SIGTERM`.

---

## 2. Generic Entity Data Models (Planned for Sprint 2 & 3)

### User Entity (Sprint 2)

```typescript
interface IUser {
  email: string;
  passwordHash: string;
  name: string;
  role: 'citizen' | 'responder' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sighting / Incident Entity (Sprint 3)

```typescript
interface IIncident {
  title: string;
  description: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'unverified' | 'verified' | 'resolving' | 'resolved' | 'dismissed';
  reportedBy: mongoose.Types.ObjectId;
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
```
