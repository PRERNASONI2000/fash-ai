//bonuses.js
// import { Gift } from 'lucide-react'

// export function Bonuses() {
//   return (
//     <section className="mx-auto max-w-3xl">
//       <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-8 text-center dark:border-white/10 dark:bg-white/[0.04]">
//         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
//           <Gift className="h-7 w-7" aria-hidden />
//         </div>
//         <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-white">Bonuses</h1>
//         <p className="mt-2 text-zinc-600 dark:text-zinc-400">
//           Rewards and credits will appear here. Coming soon.
//         </p>
//       </div>
//     </section>
//   )
// }

import { useEffect, useState } from 'react'
import { Download, Sparkles } from 'lucide-react'

interface Bonus {
  _id: string
  name: string
  imageUrl: string
  downloadLink: string
}

export function Bonuses() {
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/bonuses')
      .then(res => res.json())
      .then(data => {
        setBonuses(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching bonuses:", error)
        setError('Failed to load bonuses')
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-40 text-zinc-500 animate-pulse">
      <Sparkles className="mr-2 h-5 w-5 animate-spin" /> Loading bonuses...
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-40 text-red-500 bg-red-500/10 rounded-xl p-4">
      {error}
    </div>
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Exclusive Bonuses
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Download premium resources and boost your projects.
        </p>
      </div>

      {/* Grid Layout */}
      {bonuses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-500">
          No bonuses available right now. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bonuses.map(bonus => (
            <div
              key={bonus._id}
              className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-black/30 hover:-translate-y-1"
            >
              {/* Image Section with Hover Zoom */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={bonus.imageUrl}
                  alt={bonus.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark gradient overlay at the bottom of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-white/[0.02]">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 text-center">
                  {bonus.name}
                </h2>

                {/* Download Button - Fixed syntax and added gradient + glow */}
                <a
                  href={bonus.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/25 active:scale-95"
                >
                  <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  Download Now
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}