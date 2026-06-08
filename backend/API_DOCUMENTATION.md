# Authentication API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

## Overview
This document covers all authentication endpoints with request/response examples and frontend integration patterns.

---

## 1. Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// Missing fields
{
  "message": "Email and password are required"
}

// Invalid email
{
  "message": "Invalid email format"
}

// Weak password
{
  "message": "Password must be at least 6 characters"
}

// User exists
{
  "message": "User already exists"
}
```

---

## 2. Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// Invalid credentials
{
  "message": "Invalid Credentials"
}

// Missing fields
{
  "message": "Email and password are required"
}
```

---

## 3. Google Login/Signup

**Endpoint:** `POST /api/auth/google`

**Request Body:**
```json
{
  "idToken": "firebase_id_token_here"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response:**
```json
{
  "message": "Invalid Google token",
  "error": "token verification failed"
}
```

---

## 4. Get Current User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "profilePicture": "https://example.com/avatar.jpg",
  "googleId": null,
  "createdAt": "2024-06-01T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "message": "No token, authorization denied"
}
```

---

## 5. Update User Profile

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "profilePicture": "https://example.com/new-avatar.jpg"
}
```

**Valid Update Combinations:**
```json
// Update only name
{
  "name": "Jane Doe"
}

// Update only picture
{
  "profilePicture": "https://example.com/avatar.jpg"
}

// Update both
{
  "name": "Jane Doe",
  "profilePicture": "https://example.com/avatar.jpg"
}
```

**Success Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Jane Doe",
    "profilePicture": "https://example.com/new-avatar.jpg",
    "googleId": null,
    "createdAt": "2024-06-01T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Nothing to update
{
  "message": "Provide at least one field to update"
}

// Unauthorized
{
  "message": "Token is not valid"
}
```

---

## 6. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Note:** JWT-based logout requires frontend to remove token from localStorage.

---

## 7. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset link sent",
  "resetUrl": "http://localhost:5173/reset-password/abc123xyz789" // Only in development
}
```

**Error Responses:**
```json
// Email not provided
{
  "message": "Email is required"
}

// Invalid email format
{
  "message": "Invalid email format"
}

// User not found
{
  "message": "User not found"
}
```

---

## 8. Reset Password

**Endpoint:** `POST /api/auth/reset-password/:token`

**URL Parameter:**
```
:token - Reset token from forgot-password response
```

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**
```json
// Missing password
{
  "message": "New password is required"
}

// Weak password
{
  "message": "Password must be at least 6 characters"
}

// Invalid or expired token
{
  "message": "Invalid or expired reset token"
}
```

---

## Frontend Integration Examples

### Setup Base API Service

```javascript
// api.js or services/auth.ts
const API_BASE = 'http://localhost:5000/api/auth';

export const getAuthToken = () => localStorage.getItem('token');

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  return data;
};

export default apiCall;
```

### Register

```typescript
// Signup.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    navigate('/');
  } catch (err) {
    setError(err.message);
  }
};
```

### Login

```typescript
// Login.tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    localStorage.setItem('token', data.token);
    setShowSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  } catch (err) {
    setError(err.message);
    setShowModal(true);
  } finally {
    setIsLoading(false);
  }
};
```

### Get Current User Profile

```typescript
// Profile.tsx
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };
  
  fetchProfile();
}, []);
```

### Update Profile

```typescript
// EditProfile.tsx
const handleUpdateProfile = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, profilePicture }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    setUser(data.user);
    setSuccess('Profile updated successfully');
  } catch (err) {
    setError(err.message);
  }
};
```

### Forgot Password

```typescript
// ForgotPassword.tsx
const handleForgotPassword = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    // In development, show resetUrl
    if (data.resetUrl) {
      console.log('Reset URL:', data.resetUrl);
      // Copy to clipboard or display
    }
    
    setMessage('Check your email for reset link');
  } catch (err) {
    setError(err.message);
  }
};
```

### Reset Password

```typescript
// ResetPassword.tsx
const handleResetPassword = async (e) => {
  e.preventDefault();
  const token = new URLSearchParams(location.search).get('token');
  
  try {
    const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    
    setMessage('Password reset successful. Redirecting to login...');
    setTimeout(() => navigate('/login'), 2000);
  } catch (err) {
    setError(err.message);
  }
};
```

### Logout

```typescript
// Navbar.tsx
const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    localStorage.removeItem('token');
    navigate('/login');
  } catch (err) {
    console.error(err);
    // Clear token anyway
    localStorage.removeItem('token');
    navigate('/login');
  }
};
```

---

## Security Notes

1. **Never expose password** - API never returns user password
2. **Never expose resetPasswordToken** - Token is hashed in database
3. **Token expiry** - JWT tokens expire in 5 hours
4. **Reset token expiry** - Reset tokens expire in 30 minutes
5. **Password hashing** - All passwords are hashed with bcrypt before storage
6. **HTTPS recommended** - Use HTTPS in production

---

## Environment Variables Required

```env
MONGODB_URI=mongodb://...
JWT_SECRET=your_jwt_secret_key
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_firebase_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_APP_ID=your_firebase_app_id
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"John Doe","profilePicture":"https://example.com/avatar.jpg"}'
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password/RESET_TOKEN \
  -H "Content-Type: application/json" \
  -d '{"password":"newPassword123"}'
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Summary of Changes

### Files Updated:
1. **models/User.js** - Added: name, profilePicture, resetPasswordToken, resetPasswordExpire, createdAt
2. **routes/auth.js** - Added 5 new endpoints + validation + security improvements

### Preserved:
- ✅ Existing register/login logic
- ✅ Google authentication
- ✅ JWT middleware
- ✅ Password hashing with bcrypt
- ✅ All existing API routes

### New Endpoints (5):
- GET /api/auth/profile
- PUT /api/auth/profile
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token
