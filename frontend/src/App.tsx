// App.tsx — route-level auth gate (JWT in localStorage)
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ThemeProvider } from './context/ThemeContext'
import { Bonuses } from './pages/Bonuses'
import { Gallery } from './pages/Gallery'
// import { GenerateModel } from './pages/GenerateModel'
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
import { Support } from './pages/Support'
import { ProductToModel } from './features/ProductToModel'
import { TryOn } from './features/TryOn'
import { SwapModel } from './features/SwapModel'
import { TryonV16 } from './features/Tryon-v1.6'
import { Edit } from './features/Edit'
import { CreateModel } from './features/CreateModel'
import { ImageToVideo } from './features/ImageToVideo'
import { FacetoModel } from './features/FacetoModel'
import { Reframe } from './features/Reframe'
import { BackgroundRemove } from './features/BGRemove'

/** Paths reachable without a JWT in localStorage. */
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password'] as const

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    pathname.startsWith('/reset-password')
  )
}

/** Redirects unauthenticated users to /login; public auth pages are exempt. */
function RequireAuth() {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token && !isPublicRoute(location.pathname)) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/bonuses" element={<Bonuses />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/training" element={<Training />} />
            <Route path="/support" element={<Support />} />
             <Route path="/product-to-model" element={<ProductToModel />} />
            <Route path="/try-on" element={<TryOn />} />
            <Route path="/swap-model" element={<SwapModel />} />
            <Route path="/tryon-v1.6" element={<TryonV16 />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/create-model" element={<CreateModel />} />
            <Route path="/image-to-video" element={<ImageToVideo />} />
            <Route path="/face-to-model" element={<FacetoModel />} />
            <Route path="/reframe" element={<Reframe />} />
            <Route path="/bg-remove" element={<BackgroundRemove />} />
            {/* <Route path="/generate" element={<GenerateModel />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/credits" element={<Credit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
