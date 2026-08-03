# API Standards & Response Contracts

## 1. Unified Response Envelope

Every endpoint (successful or failed) returns the standard JSON response envelope:

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}
```

### Success Example (`200 OK` / `201 Created`)

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {
    "status": "ok"
  }
}
```

### Error Example (`400 Bad Request` / `404 Not Found` / `500 Server Error`)

```json
{
  "success": false,
  "message": "Route not found: GET /invalid-endpoint",
  "error": {
    "code": "NOT_FOUND"
  }
}
```

---

## 2. Standard Error Codes

- `BAD_REQUEST`: Validation or client payload failure (400)
- `UNAUTHORIZED`: Missing or invalid authentication token (401)
- `FORBIDDEN`: Insufficient role or access permissions (403)
- `NOT_FOUND`: Resource or route does not exist (404)
- `CONFLICT`: Duplicate unique key or state race condition (409)
- `INTERNAL_SERVER_ERROR`: Unhandled operational exception (500)
