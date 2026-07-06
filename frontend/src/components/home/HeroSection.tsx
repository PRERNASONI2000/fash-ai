//src/components/home/HeroSection.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 sm:pb-32 lg:px-8 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.35),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.25),transparent)]"
      />
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1 text-xs font-medium text-violet-700 dark:text-violet-200">
            Image → Video, powered by Veo-class models
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Motion from a single frame —{' '}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              in minutes, not weeks
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Upload references, describe the shot, and preview results in a split workspace tuned
            for creative iteration.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/generate"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 outline-none ring-offset-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-violet-500 dark:ring-offset-zinc-950"
            >
              Start generating
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300/80 bg-white/60 px-6 py-3.5 text-sm font-medium text-zinc-800 backdrop-blur transition hover:border-zinc-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              How it works
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-16 flex justify-center gap-8 text-sm text-zinc-500 dark:text-zinc-500"
        >
          {['Low-latency previews', 'Reference fidelity', 'Production callbacks'].map((t, i) => (
            <motion.span
              key={t}
              className="hidden sm:inline"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
