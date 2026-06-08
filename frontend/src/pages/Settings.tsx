import { Settings as SettingsIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-8 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
            <SettingsIcon className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Settings</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Appearance and preferences</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200/60 px-4 py-3 dark:border-white/10">
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Theme</p>
            <p className="text-xs text-zinc-500">
              Currently {theme === 'dark' ? 'dark' : 'light'} mode
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-zinc-200/80 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-violet-400/50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            Toggle theme
          </button>
        </div>
      </div>
    </section>
  )
}
