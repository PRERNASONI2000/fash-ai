import { Menu, Moon, Sun, User, CreditCard, History, LogOut, Search, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { NavDropdown } from './NavDropdown'

const menuItemClass =
  'block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5'

// ─── Profile Dropdown (backend/auth unchanged) ────────────────────────────────
function ProfileDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    localStorage.clear()
    navigate('/login')
  }

  const [userData, setUserData] = useState({ name: 'User', email: 'Loading...' })

  useEffect(() => {
    if (open) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) return
          const res = await fetch('http://localhost:5000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            setUserData({ name: data.name || data.email.split('@')[0], email: data.email })
          }
        } catch (error) {
          console.error('Failed to fetch profile', error)
        }
      }
      fetchProfile()
    }
  }, [open])

  const { email, name } = userData

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fash-avatar-btn"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <User size={18} />
      </button>
      {open && (
        <div
          role="menu"
          className="fash-profile-menu"
        >
          <div className="fash-profile-header">
            <div className="fash-profile-avatar">
              <User size={18} />
            </div>
            <div className="overflow-hidden">
              <div className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{name}</div>
              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{email}</div>
            </div>
          </div>

          <div className="fash-profile-divider" />

          <Link to="/profile" role="menuitem" className="fash-profile-item" onClick={() => setOpen(false)}>
            <User size={15} /> View Profile
          </Link>
          <Link to="/subscriptions" role="menuitem" className="fash-profile-item" onClick={() => setOpen(false)}>
            <CreditCard size={15} /> Subscriptions
          </Link>
          <Link to="/credits" role="menuitem" className="fash-profile-item" onClick={() => setOpen(false)}>
            <History size={15} /> Credits History
          </Link>
          <button type="button" onClick={handleSignOut} role="menuitem" className="fash-profile-item w-full">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
type Props = { onOpenSidebar: () => void }

export function Navbar({ onOpenSidebar }: Props) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="fash-navbar">
      {/* Left: mobile burger + logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="fash-icon-btn lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={19} />
        </button>

        <Link to="/" className="fash-navbar-brand">
          <span className="fash-brand-mark">F</span>
          <span className="hidden sm:inline">FashAI</span>
        </Link>
      </div>

      {/* Centre: Search Bar */}
      <div className="fash-search-wrap">
        <Search size={15} className="fash-search-icon" />
        <input
          type="search"
          placeholder="Search templates, styles…"
          className="fash-search-input"
          aria-label="Search"
        />
      </div>

      {/* Right: Credits + Upgrade + Theme + Profile + Auth */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Credits counter */}
        <div className="fash-credits-pill">
          <Zap size={13} className="fash-credits-icon" />
          <span className="fash-credits-label">CREDITS</span>
          <span className="fash-credits-value">248/500</span>
        </div>

        {/* Upgrade button */}
        <Link to="/subscriptions" className="fash-upgrade-btn">
          Upgrade
        </Link>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="fash-icon-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <ProfileDropdown />

        <NavDropdown label="Signup">
          <Link to="/signup" role="menuitem" className={menuItemClass}>
            Create account
          </Link>
          <Link to="/login" role="menuitem" className={menuItemClass}>
            Sign in
          </Link>
        </NavDropdown>
      </div>
    </header>
  )
}
