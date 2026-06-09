//App.tsx
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ThemeProvider } from './context/ThemeContext'
import { Bonuses } from './pages/Bonuses'
import { GenerateVideo } from './pages/GenerateVideo'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Training } from './pages/Training'
import { Settings } from './pages/Settings'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Subscription } from './pages/Subscription'
import { Credit } from './pages/Credit'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/bonuses" element={<PrivateRoute><Bonuses /></PrivateRoute>} />
            <Route path="/training" element={<PrivateRoute><Training /></PrivateRoute>} />
            <Route path="/generate" element={<PrivateRoute><GenerateVideo /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/subscriptions" element={<PrivateRoute><Subscription /></PrivateRoute>} />
            <Route path="/credits" element={<PrivateRoute><Credit /></PrivateRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
