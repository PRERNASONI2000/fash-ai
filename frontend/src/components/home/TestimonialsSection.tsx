import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { glassPanel } from '../../lib/styles'

const reviews = [
  {
    quote:
      'We replaced a week of storyboard animatics with same-day motion tests. The reference lock is scary good.',
    name: 'Maya Chen',
    role: 'Creative Director, Northbeam',
  },
  {
    quote:
      'Finally a UI that does not fight you. Prompt + image + preview in one flow — our producers actually use it.',
    name: 'Jordan Ellis',
    role: 'Head of Content, Luma Foundry',
  },
  {
    quote:
      'Callbacks into our pipeline mean we can treat generations like render jobs. Exactly what we needed.',
    name: 'Sam Okonkwo',
    role: 'VP Engineering, Framehouse',
  },
]

export function TestimonialsSection() {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % reviews.length)
  }, [])

  useEffect(() => {
    const id = window.setInterval(next, 7000)
    return () => window.clearInterval(id)
  }, [next])

  const active = reviews[index]

  return (
    <section id="testimonials" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-400">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Loved by teams who ship
          </h2>
        </motion.div>

        <div className="mt-12">
          <div className="relative min-h-[220px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.article
                key={active.name}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
                whileHover={{ scale: 1.02 }}
                className={glassPanel(
                  'mx-auto max-w-3xl p-8 text-center shadow-xl transition-shadow hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5',
                )}
              >
                <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-200">
                  “{active.quote}”
                </p>
                <footer className="mt-6">
                  <p className="font-semibold text-zinc-900 dark:text-white">{active.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{active.role}</p>
                </footer>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-violet-600 dark:bg-violet-400' : 'w-2.5 bg-zinc-300 dark:bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.li
              key={r.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={glassPanel(
                'cursor-default p-4 text-left text-sm text-zinc-600 shadow-md transition-shadow hover:shadow-lg dark:text-zinc-400',
              )}
            >
              <p className="line-clamp-3 font-medium text-zinc-800 dark:text-zinc-200">
                “{r.quote}”
              </p>
              <p className="mt-3 text-xs text-zinc-500">{r.name}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
