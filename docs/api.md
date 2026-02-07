# API Documentation

This document provides comprehensive information about all public and admin APIs available in the portfolio application.

## Table of Contents
- [Authentication](#authentication)
- [Public APIs](#public-apis)
- [Admin APIs](#admin-apis)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Security](#security)

## Authentication

Currently, the admin APIs use a simple password-based authentication. This should be enhanced with proper JWT tokens in production.

### Admin Authentication
```typescript
// In your API routes:
const adminPassword = process.env.ADMIN_PASSWORD
const providedPassword = headers.get('x-admin-password')

if (adminPassword !== providedPassword) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

## Public APIs

### Contact Form API

#### POST `/api/contact`

Send a message through the contact form.

**Rate Limit:** 5 requests per 15 minutes per email address

**Request Headers:**
```http
Content-Type: application/json
```

**Request Body:**
```typescript
{
  name: string        // Required: 2-100 characters
  email: string       // Required: Valid email format, max 255 chars
  subject?: string    // Optional: Max 200 characters
  message: string     // Required: 10-2000 characters
}
```

**Success Response (200):**
```typescript
{
  success: true,
  message: "Message sent successfully"
}
```

**Error Responses:**

| Status | Code | Description |
|---------|------|-------------|
| 400 | Bad Request | `{"error": "Name, email, and message are required"}` |
| 400 | Bad Request | `{"error": "Invalid email address"}` |
| 400 | Bad Request | `{"error": "Too many requests. Please try again later."}` |
| 429 | Too Many Requests | `{"error": "Rate limit exceeded"}` |
| 500 | Internal Server Error | `{"error": "Failed to send message"}` |

**Example Request:**
```bash
curl -X POST https://yourportfolio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a project with you."
  }'
```

## Admin APIs

All admin APIs require authentication via the `X-Admin-Password` header.

### Projects Management

#### GET `/api/admin/projects`

Get all projects in the portfolio.

**Request Headers:**
```http
X-Admin-Password: your-admin-password
```

**Success Response (200):**
```typescript
{
  projects: Array<{
    id: string
    title: string
    description: string
    longDescription?: string
    imageUrl?: string
    githubUrl?: string
    liveUrl?: string
    tags: string[]
    featured: boolean
    order: number
    createdAt: string
    updatedAt: string
  }>
}
```

**Example Request:**
```bash
curl -X GET https://yourportfolio.com/api/admin/projects \
  -H "X-Admin-Password: your-admin-password"
```

#### POST `/api/admin/projects`

Create a new project in the portfolio.

**Request Headers:**
```http
Content-Type: application/json
X-Admin-Password: your-admin-password
```

**Request Body:**
```typescript
{
  title: string          // Required: Project title
  description: string    // Required: Short description
  longDescription?: string  // Optional: Detailed description
  githubUrl?: string     // Optional: GitHub repository URL
  liveUrl?: string       // Optional: Live demo URL
  tags: string[]        // Required: Array of technology tags
  featured?: boolean      // Optional: Show in featured section (default: false)
  order?: number         // Optional: Display order (default: 0)
}
```

**Success Response (201):**
```typescript
{
  project: Project
}
```

**Error Responses:**

| Status | Code | Description |
|---------|------|-------------|
| 400 | Bad Request | `{"error": "Title, description, and tags are required"}` |
| 401 | Unauthorized | `{"error": "Invalid admin password"}` |
| 500 | Internal Server Error | `{"error": "Failed to create project"}` |

**Example Request:**
```bash
curl -X POST https://yourportfolio.com/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Password: your-admin-password" \
  -d '{
    "title": "My Awesome Project",
    "description": "A project description",
    "tags": ["React", "TypeScript", "Next.js"],
    "featured": true,
    "order": 1
  }'
```

### Contact Messages Management

#### GET `/api/admin/messages`

Get all contact messages received through the form.

**Request Headers:**
```http
X-Admin-Password: your-admin-password
```

**Success Response (200):**
```typescript
{
  messages: Array<{
    id: string
    name: string
    email: string
    subject?: string
    message: string
    createdAt: string
  }>
}
```

**Example Request:**
```bash
curl -X GET https://yourportfolio.com/api/admin/messages \
  -H "X-Admin-Password: your-admin-password"
```

#### DELETE `/api/admin/messages`

Delete a specific contact message.

**Query Parameters:**
- `id` (required): Message ID to delete

**Request Headers:**
```http
X-Admin-Password: your-admin-password
```

**Success Response (200):**
```typescript
{
  success: true
}
```

**Error Responses:**

| Status | Code | Description |
|---------|------|-------------|
| 400 | Bad Request | `{"error": "Message ID is required"}` |
| 401 | Unauthorized | `{"error": "Invalid admin password"}` |
| 500 | Internal Server Error | `{"error": "Failed to delete message"}` |

**Example Request:**
```bash
curl -X DELETE "https://yourportfolio.com/api/admin/messages?id=msg-123" \
  -H "X-Admin-Password: your-admin-password"
```

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
{
  success: boolean,
  error?: string,
  message?: string,
  data?: T
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting

### Contact Form Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 5 per email
- **Storage:** In-memory (use Redis in production)

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 2024-01-01T12:15:00Z
X-RateLimit-Policy: fixed_window;w=900;r=5
```

## Security

### Input Validation

All inputs are validated and sanitized:

1. **Email Validation:** Regex-based validation for proper email format
2. **String Length:** Enforced maximum and minimum lengths
3. **Special Characters:** Dangerous characters removed
4. **SQL Injection:** Parameterized queries prevent injection
5. **XSS Prevention:** All inputs are sanitized

### Security Headers

All responses include security headers:

```http
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: origin-when-cross-origin
X-DNS-Prefetch-Control: on
```

### Environment Variables

Sensitive configuration uses environment variables:

```env
DATABASE_URL="file:./db/custom.db"
ADMIN_PASSWORD="your-secure-password"
NEXT_PUBLIC_GA_ID="analytics-id"
```

## TypeScript Types

### Common Interfaces

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  imageUrl?: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  featured?: boolean
  order?: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  createdAt: string
}
```

## Testing the APIs

### Using cURL
```bash
# Contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'

# Get projects (admin)
curl -X GET http://localhost:3000/api/admin/projects \
  -H "X-Admin-Password: password"

# Create project (admin)
curl -X POST http://localhost:3000/api/admin/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Password: password" \
  -d '{"title":"Test Project","description":"Test","tags":["React"]}'
```

### Using JavaScript/TypeScript
```typescript
// Contact form
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello!',
  }),
})

const data = await response.json()
console.log(data)
```

## Best Practices for API Consumers

1. **Handle Errors Gracefully**
   - Always check the `success` field
   - Display user-friendly error messages
   - Implement retry logic for transient errors

2. **Implement Rate Limiting Awareness**
   - Respect `X-RateLimit-Remaining` header
   - Show countdown when rate limited
   - Queue requests when appropriate

3. **Type Safety**
   - Use TypeScript types provided
   - Validate responses against expected types
   - Handle unexpected data gracefully

4. **Performance**
   - Implement request caching where appropriate
   - Use pagination for large datasets
   - Lazy load data when possible

## Support

For API issues or questions:
- Open an issue on GitHub
- Contact development team
- Check server logs for detailed error information

---

Last updated: 2024-01-XX
