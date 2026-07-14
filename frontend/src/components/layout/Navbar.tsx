//components/layout/Navbar.tsx
import { Menu, Moon, Sun, User, CreditCard, History, LogOut, Search, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
// import { checkCredits } from '../../lib/fashnService'
// import { NavDropdown } from './NavDropdown'
// ✅ Add
import { useAuth } from '../../context/AuthContext'

// const API_URL = import.meta.env.VITE_API_URL;

// const menuItemClass =
//   'block w-full px-4 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5'

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
  logout();
  navigate('/login', { replace: true });
}
  

   
const { user, logout } = useAuth();

const email = user?.email || 'Loading...';
const name = user?.name || user?.email?.split('@')[0] || 'User';

// Beautiful avatar letter
const avatarLetter =
  name.trim().charAt(0).toUpperCase() ||
  email.trim().charAt(0).toUpperCase() ||
  'U';

  return (
    <div ref={ref} className="relative">
    <button
  type="button"
  onClick={() => setOpen((o) => !o)}
  className="fash-avatar-btn bg-gradient-to-br from-[#b5652a] to-[#d97a40] text-white font-semibold"
>
  {avatarLetter}
</button>
      {open && (
        <div
          role="menu"
          className="fash-profile-menu"
        >
          <div className="fash-profile-header overflow-hidden transition-all duration-300 ease-in-out max-h-24 opacity-100 lg:max-h-0 lg:opacity-0 lg:p-0 lg:pointer-events-none">
           <div className="fash-profile-avatar bg-gradient-to-br from-[#b5652a] to-[#d97a40] text-white font-semibold">
  {avatarLetter}
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

   // ✅ Old checkCredits removed, now using useUserData
  const { user } = useAuth();
const credits = user?.credits ?? null;

//   const [credits, setCredits] = useState<number | null>(null);

// useEffect(() => {
//   const loadCredits = async () => {
//     try {
//       const data = await checkCredits();
//       setCredits(data.credits.total);
//     } catch (err) {
//       console.error('Credit check failed', err);
//     }
//   };

//   loadCredits();
// }, []);
 
  return (
    <header className="fash-navbar">
      {/* Left: mobile burger + logo */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="fash-icon-btn flex lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={19} />
        </button>

        <Link to="/" className="fash-navbar-brand flex lg:hidden">
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
          <span className="fash-credits-value">{credits !== null ? credits : '...'}</span>
        </div>

        {/* Upgrade button */}
        <Link to="/subscriptions" className="fash-upgrade-btn">
          Upgrade
        </Link>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="fash-icon-btn flex"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <ProfileDropdown />

        {/* <NavDropdown label="Signup">
          <Link to="/signup" role="menuitem" className={menuItemClass}>
            Create account
          </Link>
          <Link to="/login" role="menuitem" className={menuItemClass}>
            Sign in
          </Link>
        </NavDropdown> */}
      </div>
    </header>
  )
}
