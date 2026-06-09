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
    <div className="flex justify-center items-center min-h-40 text-zinc-500">
      <Sparkles className="mr-2 h-4 w-4 animate-spin text-violet-500" />
      <span className="text-sm animate-pulse">Loading bonuses…</span>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-40">
      <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-6 py-4 text-sm text-red-600 dark:text-red-400">{error}</div>
    </div>
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Exclusive Bonuses</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Download premium resources and boost your projects.
        </p>
      </div>

      {bonuses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-500">
          No bonuses available right now. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bonuses.map(bonus => (
            <div
              key={bonus._id}
              className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-zinc-900/8 dark:hover:shadow-black/30 hover:-translate-y-1"
            >
              <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-white/[0.04]">
                <img
                  src={bonus.imageUrl}
                  alt={bonus.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-4">
                  {bonus.name}
                </h2>
                <a
                  href={bonus.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-black px-4 py-2.5 text-sm font-semibold transition-all shadow-sm active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}