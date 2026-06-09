const glass =
  'rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/5 dark:border-white/[0.07] dark:bg-[#17171b] dark:shadow-black/30'

export function glassPanel(extra?: string) {
  return [glass, extra].filter(Boolean).join(' ')
}
