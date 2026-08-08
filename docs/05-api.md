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

---

## 4. Authentication Endpoints

### 4.1 User Registration

- **Method**: `POST`
- **Route**: `/api/v1/auth/register`
- **Description**: Registers a new user account with encrypted password storage.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:

```json
{
  "username": "peterparker",
  "email": "peter.parker@dailybugle.com",
  "password": "Password123!"
}
```

- **Success Response `201 Created`**:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "66b1a2c3d4e5f6a7b8c9d0e1",
      "username": "peterparker",
      "email": "peter.parker@dailybugle.com",
      "role": "citizen",
      "isActive": true,
      "createdAt": "2026-08-08T02:00:00.000Z",
      "updatedAt": "2026-08-08T02:00:00.000Z"
    }
  }
}
```

- **Error Responses**:
  - `400 Bad Request`: Validation failure (e.g. invalid email format or weak password).
  - `409 Conflict`: Username or email already registered (`USERNAME_CONFLICT` or `EMAIL_CONFLICT`).

---

### 4.2 User Login

- **Method**: `POST`
- **Route**: `/api/v1/auth/login`
- **Description**: Authenticates user credentials and returns a signed JWT access token.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:

```json
{
  "email": "peter.parker@dailybugle.com",
  "password": "Password123!"
}
```

- **Success Response `200 OK`**:

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66b1a2c3d4e5f6a7b8c9d0e1",
      "username": "peterparker",
      "email": "peter.parker@dailybugle.com",
      "role": "citizen"
    }
  }
}
```

- **Error Responses**:
  - `400 Bad Request`: Missing or malformed email/password payload.
  - `401 Unauthorized`: Invalid email or password credentials (`INVALID_CREDENTIALS`).

---

### 4.3 Authentication Identity Probe

- **Method**: `GET`
- **Route**: `/api/v1/auth/me`
- **Description**: Protected test probe verifying active JWT authentication.
- **Request Headers**: `Authorization: Bearer <access_token>`
- **Success Response `200 OK`**:

```json
{
  "success": true,
  "message": "Authenticated user retrieved successfully",
  "data": {
    "user": {
      "id": "66b1a2c3d4e5f6a7b8c9d0e1",
      "email": "peter.parker@dailybugle.com"
    }
  }
}
```

- **Error Responses**:
  - `401 Unauthorized`: Missing, expired, or invalid Bearer token (`UNAUTHORIZED`).

---

## 5. User Profile Endpoints

### 5.1 Get Current User Profile

- **Method**: `GET`
- **Route**: `/api/v1/users/me`
- **Description**: Protected endpoint that queries the database using `req.user.id` and returns the sanitized user profile.
- **Authentication**: Required (`authenticateUser` middleware)
- **Request Headers**:
  - `Authorization: Bearer <access_token>`
- **Success Response `200 OK`**:

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e1",
    "username": "peterparker",
    "email": "peter.parker@dailybugle.com",
    "role": "citizen",
    "isActive": true,
    "createdAt": "2026-08-08T02:00:00.000Z",
    "updatedAt": "2026-08-08T02:00:00.000Z"
  }
}
```

- **Error Responses**:
  - `401 Unauthorized`: Missing, expired, malformed, or invalid Bearer token (`UNAUTHORIZED`).

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

- `404 Not Found`: User identified by token does not exist in the database (`USER_NOT_FOUND`).

```json
{
  "success": false,
  "message": "User not found",
  "error": {
    "code": "USER_NOT_FOUND"
  }
}
```

---

## 6. Role-Based Access Control (RBAC)

Role-based authorization is enforced declaratively across protected routes via the `authorizeRoles(...allowedRoles)` middleware factory.

### 6.1 Supported Roles

- `citizen` — Standard user role with permissions to report sightings/incidents and view public data.
- `responder` — Emergency response personnel authorized to triage and update incident statuses.
- `admin` — System administrator with complete operational and administrative privileges.

### 6.2 Error Envelope for Forbidden Requests (`403 Forbidden`)

When an authenticated user attempts to access an endpoint requiring a higher privilege level, the server rejects the request with HTTP `403 Forbidden`:

```json
{
  "success": false,
  "message": "Forbidden: Insufficient permissions",
  "error": {
    "code": "FORBIDDEN"
  }
}
```
