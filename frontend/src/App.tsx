// App.tsx — route-level auth gate (JWT in localStorage)
import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
//general imports
// import { GenerateModel } from './pages/GenerateModel'
//lazy imports for code splitting
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
const Bonuses = lazy(() => import('./pages/Bonuses').then((m) => ({ default: m.Bonuses })))
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })))
const Training = lazy(() => import('./pages/Training').then((m) => ({ default: m.Training })))
const Support = lazy(() => import('./pages/Support').then((m) => ({ default: m.Support })))
const Signup = lazy(() => import('./pages/Signup').then((m) => ({ default: m.Signup })))
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('./pages/ResetPassword').then((m) => ({ default: m.ResetPassword })))
const Credit = lazy(() => import('./pages/Credit').then((m) => ({ default: m.Credit })))
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })))
const Subscription = lazy(() => import('./pages/Subscription').then((m) => ({ default: m.Subscription })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))
const Template = lazy(() => import('./pages/Template').then((m) => ({ default: m.Template })))
//lazy imports for features
const  BackgroundRemove = lazy(() => import('./features/BGRemove').then((m) => ({ default: m.BackgroundRemove })))
const  CreateModel = lazy(() => import('./features/CreateModel').then((m) => ({ default: m.CreateModel })))
const  Edit = lazy(() => import('./features/Edit').then((m) => ({ default: m.Edit })))
const  FacetoModel = lazy(() => import('./features/FacetoModel').then((m) => ({ default: m.FacetoModel })))
const  ImageToVideo = lazy(() => import('./features/ImageToVideo').then((m) => ({ default: m.ImageToVideo })))
const  ProductToModel = lazy(() => import('./features/ProductToModel').then((m) => ({ default: m.ProductToModel })))
const  Reframe = lazy(() => import('./features/Reframe').then((m) => ({ default: m.Reframe })))
const  SwapModel = lazy(() => import('./features/SwapModel').then((m) => ({ default: m.SwapModel })))
const  TryOn = lazy(() => import('./features/TryOn').then((m) => ({ default: m.TryOn })))
const  TryonV16 = lazy(() => import('./features/Tryon-v1.6').then((m) => ({ default: m.TryonV16 })))

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
      <AuthProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="flex justify-center items-center min-h-40 text-zinc-500 animate-pulse">Loading...</div>}>
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
            <Route path="/generate" element={<Template />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/credits" element={<Credit />} />
            <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
        </Suspense>
      </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>
  )
}
