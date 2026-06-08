import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  LayoutTemplate,
  UserCircle2,
  Sparkles,
  Zap,
  RefreshCw,
  Gift,
  GraduationCap,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

type Props = {
  open: boolean
  onClose: () => void
}

// ─── Nav groups ────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { to: '/',         label: 'Dashboard',       icon: LayoutDashboard, end: true  },
  { to: '/generate', label: 'Templates',        icon: LayoutTemplate,  end: false },
] as const

const NAV_TOOLS = [
  { to: '/generate', label: 'Product to Model', icon: UserCircle2,    end: false },
  { to: '/generate', label: 'Try On',           icon: Sparkles,        end: false },
  { to: '/generate', label: 'Create Model',     icon: Zap,             end: false },
  { to: '/generate', label: 'Swap Model',       icon: RefreshCw,       end: false },
] as const

const NAV_RESOURCES = [
  { to: '/bonuses',  label: 'Bonuses',          icon: Gift,            end: false },
  { to: '/training', label: 'Training',         icon: GraduationCap,   end: false },
] as const

// ─── Reusable nav link renderer ────────────────────────────────────────────────
function NavGroup({
  label,
  items,
  onClose,
}: {
  label: string
  items: ReadonlyArray<{ to: string; label: string; icon: React.ElementType; end: boolean }>
  onClose: () => void
}) {
  return (
    <div>
      <p className="fash-nav-group-label">{label}</p>
      <ul className="space-y-0.5 mt-1">
        {items.map(({ to, label: itemLabel, icon: Icon, end }) => (
          <li key={itemLabel}>
            <NavLink
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                isActive
                  ? 'fash-nav-item fash-nav-active'
                  : 'fash-nav-item fash-nav-inactive'
              }
            >
              <Icon size={17} className="shrink-0" aria-hidden />
              {itemLabel}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ open, onClose }: Props) {
  return (
    <aside
      className={[
        'fash-sidebar',
        'fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col transition-transform duration-300 ease-out',
        'lg:static lg:z-auto lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
      aria-label="Sidebar navigation"
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <motion.div initial={false} className="fash-sidebar-logo">
        <div className="fash-logo-mark">
          <Sparkles size={18} color="white" />
        </div>
        <span className="fash-logo-text">FashAI</span>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="fash-sidebar-close lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </motion.div>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        <NavGroup label="Main"      items={NAV_MAIN}      onClose={onClose} />
        <NavGroup label="AI Tools"  items={NAV_TOOLS}     onClose={onClose} />
        <NavGroup label="Resources" items={NAV_RESOURCES} onClose={onClose} />
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="fash-sidebar-footer">
        FashAI Studio · v1.0
      </div>
    </aside>
  )
}
