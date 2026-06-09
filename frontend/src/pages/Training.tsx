//Training.tsx
import { useState, useEffect } from 'react'
import { PlayCircle, GraduationCap } from 'lucide-react'

interface TrainingVideo {
    _id: string
    title: string
    embedCode: string
}

export function Training() {
    const [videos, setVideos] = useState<TrainingVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/api/trainings')
            .then(res => res.json())
            .then(data => {
                setVideos(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Error fetching videos:", error)
                setError('Failed to load trainings')
                setLoading(false)
            })
    }, [])

    if (loading) return (
        <div className="flex justify-center items-center min-h-40 text-zinc-500">
            <GraduationCap className="mr-2 h-4 w-4 animate-bounce text-violet-500" />
            <span className="text-sm animate-pulse">Loading training modules…</span>
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
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Training & Tutorials</h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Watch step-by-step guides to master AI video generation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map(video => (
                    <div
                        key={video._id}
                        className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md dark:hover:shadow-black/30 hover:-translate-y-0.5"
                    >
                        <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden">
                            <iframe
                                src={video.embedCode}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full border-0"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 -z-10">
                                <PlayCircle className="h-14 w-14 text-zinc-700" />
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <PlayCircle className="h-4 w-4 text-violet-500 flex-shrink-0" />
                                {video.title}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}