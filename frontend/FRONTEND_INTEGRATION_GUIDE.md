# Frontend Integration Quick Guide

## Copy-Paste Ready Code Snippets

### 1. Auth Service Module

```typescript
// src/services/authService.ts
const API_BASE = 'http://localhost:5000/api/auth';

export const authService = {
  // Get stored token
  getToken: () => localStorage.getItem('token'),

  // Save token
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Clear token
  clearToken: () => {
    localStorage.removeItem('token');
  },

  // Generic API call with auth
  async call(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
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
  },

  // Auth endpoints
  register: (email: string, password: string) =>
    authService.call('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    authService.call('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleAuth: (idToken: string) =>
    authService.call('/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  getProfile: () =>
    authService.call('/profile', { method: 'GET' }),

  updateProfile: (name?: string, profilePicture?: string) =>
    authService.call('/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, profilePicture }),
    }),

  logout: () =>
    authService.call('/logout', { method: 'POST' }),

  forgotPassword: (email: string) =>
    authService.call('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    authService.call(`/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
};
```

---

### 2. Protected Route Component

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = authService.getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

### 3. Auth Context (Optional but Recommended)

```typescript
// src/context/AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  _id: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name?: string, picture?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const existingToken = authService.getToken();
    if (existingToken) {
      setToken(existingToken);
      fetchUser(existingToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchUser(token: string) {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      authService.clearToken();
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await authService.login(email, password);
      authService.setToken(response.token);
      setToken(response.token);
      await fetchUser(response.token);
    } catch (err) {
      throw err;
    }
  }

  async function register(email: string, password: string) {
    try {
      const response = await authService.register(email, password);
      authService.setToken(response.token);
      setToken(response.token);
      await fetchUser(response.token);
    } catch (err) {
      throw err;
    }
  }

  function logout() {
    authService.clearToken();
    setToken(null);
    setUser(null);
  }

  async function updateProfile(name?: string, picture?: string) {
    try {
      const response = await authService.updateProfile(name, picture);
      setUser(response.user);
    } catch (err) {
      throw err;
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### 4. Updated Login Component

```typescript
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Your existing UI */}
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {/* Form fields */}
        <button disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
```

---

### 5. Profile Page

```typescript
// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfilePicture(user.profilePicture);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await updateProfile(name, profilePicture);
      setMessage('Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <form onSubmit={handleUpdate}>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <div>
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Profile Picture URL</label>
          <input
            type="url"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {profilePicture && (
          <div>
            <img src={profilePicture} alt="Preview" style={{ maxWidth: '100px' }} />
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
```

---

### 6. Forgot Password Page

```typescript
// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { authService } from '../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message);
      
      // In development, show reset URL
      if (response.resetUrl) {
        console.log('Reset URL:', response.resetUrl);
        // Optionally: Copy to clipboard or show in UI
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <p>Enter your email to receive a password reset link</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
```

---

### 7. Reset Password Page

```typescript
// src/pages/ResetPassword.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';

export function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-container">
        <h1>Password Reset Successful</h1>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div>
          <label>New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
```

---

### 8. Logout Button

```typescript
// src/components/Navbar.tsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      {user && (
        <>
          <span>Welcome, {user.name || user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}
```

---

### 9. App Setup with Auth Provider

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## Implementation Checklist

- [ ] Copy authService to `src/services/authService.ts`
- [ ] Create AuthContext in `src/context/AuthContext.tsx`
- [ ] Create ProtectedRoute component
- [ ] Update Login.tsx with new service
- [ ] Create Profile.tsx page
- [ ] Create ForgotPassword.tsx page
- [ ] Create ResetPassword.tsx page with `:token` route
- [ ] Add logout button to Navbar
- [ ] Wrap App with AuthProvider
- [ ] Update routing to include new pages
- [ ] Test all authentication flows

---

## Quick Testing

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 2. Get token from response, then:

# 3. Get profile
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Update profile
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"John Doe"}'
```

---

## Troubleshooting

**Q: "No token, authorization denied"**
- A: Token not in localStorage. User needs to login first.

**Q: "Token is not valid"**
- A: Token expired (5h) or JWT_SECRET mismatch. User needs to login again.

**Q: "Invalid reset token"**
- A: Token expired (30min) or invalid. Request new reset link.

**Q: Profile not updating**
- A: Check Authorization header format: `Bearer {token}` (with space)

---

Done! Copy-paste these code snippets into your project and update as needed.
