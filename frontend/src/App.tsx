//App.tsx
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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/bonuses" element={<Bonuses />} />
            <Route path="/training" element={<Training />} />
            <Route path="/generate" element={<GenerateVideo />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/credits" element={<Credit />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
