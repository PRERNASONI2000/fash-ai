import { StrictMode } from 'react'
import { AuthProvider } from './context/AuthContext'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fash.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <AuthProvider>
    <App />
   </AuthProvider>
  </StrictMode>,
)
