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

## 6. Incident Endpoints

### 6.1 Create Incident

- **Method**: `POST`
- **Route**: `/api/v1/incidents`
- **Purpose**: Creates and records a new incident in the system.
- **Authentication**: Required (`authenticateUser` middleware)
- **Request Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <access_token>`
- **Request Body**:

```json
{
  "title": "Bank robbery in progress",
  "description": "Armed robbery reported at Financial District branch.",
  "category": "crime",
  "latitude": 40.7128,
  "longitude": -74.006,
  "address": "123 Wall St, New York, NY"
}
```

- **Backend-Managed Default Values**:
  - `createdBy`: Derived from `req.user.id` (authenticated user).
  - `status`: Automatically assigned to `"open"`.
  - `severity`: Automatically assigned to `"medium"`.
  - `assignedTo`: Automatically assigned to `null`.
  - Clients cannot submit `status`, `severity`, `createdBy`, or `assignedTo`; payloads containing these fields are rejected by strict validation.

- **Success Response `201 Created`**:

```json
{
  "success": true,
  "message": "Incident reported successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e2",
    "title": "Bank robbery in progress",
    "description": "Armed robbery reported at Financial District branch.",
    "category": "crime",
    "severity": "medium",
    "status": "open",
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Wall St, New York, NY",
    "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
    "assignedTo": null,
    "createdAt": "2026-08-08T15:00:00.000Z",
    "updatedAt": "2026-08-08T15:00:00.000Z"
  }
}
```

- **Error Responses**:
  - `400 Bad Request`: Validation failure (missing required fields, invalid category, coordinates out of range, or unauthorized/extra keys).

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "category",
        "message": "Invalid category"
      }
    ]
  }
}
```

- `401 Unauthorized`: Missing, expired, malformed, or invalid Bearer token.

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": {
    "code": "UNAUTHORIZED"
  }
}
```

### 6.2 List Incidents

- **Method**: `GET`
- **Route**: `/api/v1/incidents`
- **Purpose**: Query and retrieve a paginated list of incidents sorted newest-first.
- **Authentication**: Required (`authenticateUser` middleware; accessible by `citizen`, `responder`, `admin`).
- **Request Headers**:
  - `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `page` (optional): Page number, positive integer >= 1 (default: `1`).
  - `limit` (optional): Page size, integer between 1 and 100 (default: `10`, max: `100`).
  - `category` (optional): Filter by incident category (`crime`, `hazard`, `accident`, `medical`, `other`).
  - `severity` (optional): Filter by incident severity (`low`, `medium`, `high`, `critical`).
  - `status` (optional): Filter by incident status (`open`, `in_progress`, `resolved`, `closed`).
  - _Note_: Filters combine using logical `AND`. Unknown query parameters are strictly rejected.
- **Sorting**: Newest first by `createdAt: -1`, with `_id: -1` as deterministic tie-breaker.
- **Success Response `200 OK`**:

```json
{
  "success": true,
  "message": "Incidents retrieved successfully",
  "data": [
    {
      "id": "66b1a2c3d4e5f6a7b8c9d0e2",
      "title": "Bank robbery in progress",
      "description": "Armed robbery reported at Financial District branch.",
      "category": "crime",
      "severity": "medium",
      "status": "open",
      "latitude": 40.7128,
      "longitude": -74.006,
      "address": "123 Wall St, New York, NY",
      "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
      "assignedTo": null,
      "createdAt": "2026-08-08T15:00:00.000Z",
      "updatedAt": "2026-08-08T15:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

- **Error Responses**:
  - `400 Bad Request`: Validation failure (invalid enum value, page < 1, limit > 100, non-integer numbers, or unrecognized query parameters).

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "limit",
        "message": "Limit cannot exceed 100"
      }
    ]
  }
}
```

- `401 Unauthorized`: Missing or invalid Bearer token.

### 6.3 Get Incident by ID

- **Method**: `GET`
- **Route**: `/api/v1/incidents/:id`
- **Purpose**: Retrieves a single incident by its unique 24-hex-character ObjectId.
- **Authentication**: Required (`authenticateUser` middleware; accessible by `citizen`, `responder`, `admin`).
- **Request Headers**:
  - `Authorization: Bearer <access_token>`
- **Path Parameters**:
  - `id`: 24-character hexadecimal MongoDB ObjectId string.
- **Success Response `200 OK`**:

```json
{
  "success": true,
  "message": "Incident retrieved successfully",
  "data": {
    "id": "66b1a2c3d4e5f6a7b8c9d0e2",
    "title": "Bank robbery in progress",
    "description": "Armed robbery reported at Financial District branch.",
    "category": "crime",
    "severity": "medium",
    "status": "open",
    "latitude": 40.7128,
    "longitude": -74.006,
    "address": "123 Wall St, New York, NY",
    "createdBy": "66b1a2c3d4e5f6a7b8c9d0e1",
    "assignedTo": null,
    "createdAt": "2026-08-08T15:00:00.000Z",
    "updatedAt": "2026-08-08T15:00:00.000Z"
  }
}
```

- **Error Responses**:
  - `400 Bad Request`: Malformed `id` parameter (invalid 24-character hexadecimal format).

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "id",
        "message": "Invalid incident ID format"
      }
    ]
  }
}
```

- `401 Unauthorized`: Missing or invalid Bearer token.
- `404 Not Found`: Incident not found for the given ObjectId.

```json
{
  "success": false,
  "message": "Incident not found",
  "error": {
    "code": "INCIDENT_NOT_FOUND"
  }
}
```

---

## 7. Role-Based Access Control (RBAC)

Role-based authorization is enforced declaratively across protected routes via the `authorizeRoles(...allowedRoles)` middleware factory.

### 7.1 Supported Roles

- `citizen` — Standard user role with permissions to report sightings/incidents and view public data.
- `responder` — Emergency response personnel authorized to triage and update incident statuses.
- `admin` — System administrator with complete operational and administrative privileges.

### 7.2 Error Envelope for Forbidden Requests (`403 Forbidden`)

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
