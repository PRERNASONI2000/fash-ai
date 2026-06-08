import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { glassPanel } from '../../lib/styles'

const features = [
  {
    title: 'Studio-grade motion',
    body: 'Turn stills into cinematic clips with temporal consistency and natural camera movement.',
  },
  {
    title: 'Reference-aware',
    body: 'Lock subject identity from your uploads while the model handles lighting and motion.',
  },
  {
    title: 'Fast iteration',
    body: 'Swap models, aspect ratios, and prompts without leaving a single focused workspace.',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            About
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Built for teams shipping video at scale
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            VeoGen pairs frontier image-to-video models with a workflow that feels like a creative
            suite — not a science experiment.
          </p>
        </motion.div>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.li key={f.title} variants={item}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={glassPanel(
                  'group h-full p-6 text-left ring-1 ring-transparent transition-shadow hover:shadow-xl hover:shadow-violet-500/10 hover:ring-violet-500/20 dark:hover:shadow-violet-500/5',
                )}
              >
                <div className="h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-80 transition-opacity group-hover:opacity-100" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {f.body}
                </p>
                <Link
                  to="/generate"
                  className="mt-5 inline-flex text-sm font-medium text-violet-600 underline-offset-4 hover:underline dark:text-violet-400"
                >
                  Open generator
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
