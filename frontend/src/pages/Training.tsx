//Training.tsx
import { useFetch } from '../hooks/useFetch'
import { PlayCircle, GraduationCap } from 'lucide-react'

// const API_URL = import.meta.env.VITE_API_URL;

interface TrainingVideo {
    _id: string
    title: string
    embedCode: string
}

export function Training() {
   const { data: videos, loading, error } = useFetch<TrainingVideo[]>(`${import.meta.env.VITE_API_URL}/api/trainings`)

    if (loading) return (
        <div className="flex justify-center items-center min-h-40 text-zinc-500 animate-pulse">
            <GraduationCap className="mr-2 h-5 w-5 animate-bounce" /> Loading training modules...
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
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent">
                    Training & Tutorials
                </h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                    Watch step-by-step guides to master AI video generation.
                </p>
            </div>

            {/* Grid Layout - 2 in a row on medium screens, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {videos?.map(video => (
                    <div
                        key={video._id}
                        className="group flex flex-col rounded-2xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[rgba(181,101,42,0.15)] dark:hover:shadow-black/30 hover:-translate-y-1"
                    >
                        {/* Video Embed Section with 16:9 Aspect Ratio */}
                        <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden">
                            <iframe
                                src={video.embedCode}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-300 group-hover:opacity-90"
                            />
                            {/* Fallback decorative overlay (Optional, hides when iframe loads) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 -z-10">
                                <PlayCircle className="h-16 w-16 text-zinc-600" />
                            </div>
                        </div>

                        {/* Text Content Section */}
                        <div className="p-6 flex flex-col flex-1">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                                <PlayCircle className="h-5 w-5 text-[#d97a40] flex-shrink-0" />
                                {video.title}
                            </h2>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}