const glass =
  'rounded-2xl border border-zinc-900/10 bg-white/70 shadow-lg shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/40'

export function glassPanel(extra?: string) {
  return [glass, extra].filter(Boolean).join(' ')
}
