# API Specification & Endpoints

## 1. Base URL & Versioning

- Development Base URL: `http://localhost:5000`
- Current API Version: `v1` (`/api/v1`)

---

## 2. Standardized Envelope Structure

All HTTP responses adhere to the standard envelope:

```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}
```

---

## 3. Endpoints

### 3.1 Health Probe (Root)

- **Method**: `GET`
- **Route**: `/health`
- **Description**: Returns operational heartbeat.
- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok"
  }
}
```

### 3.2 Health Probe (Versioned)

- **Method**: `GET`
- **Route**: `/api/v1/health`
- **Description**: Versioned health check probe.
- **Response `200 OK`**:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok"
  }
}
```
