import { Settings as SettingsIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <section className="mx-auto max-w-3xl px-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 shadow-sm">
            <SettingsIcon className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">Settings</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Appearance and preferences</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Appearance</p>
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Theme</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                Currently {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.06] hover:bg-zinc-50 dark:hover:bg-white/[0.1] px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 transition shadow-sm"
            >
              Toggle theme
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
