//frontend/src/pages/Template.tsx
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  RefreshCw,
  UserCircle2,
  Edit3,
  Video,
  Move,
  X,
  LayoutTemplate,
} from 'lucide-react';

interface Template {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
  image: string;
  gradient: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'product-to-model',
    icon: UserCircle2,
    label: 'Product to Model',
    description: 'Place your product on an AI-generated fashion model.',
    to: '/product-to-model',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    id: 'tryon-max',
    icon: Sparkles,
    label: 'Try-On Max',
    description: 'Studio-grade virtual try-on with high resolution.',
    to: '/try-on',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80',
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    id: 'tryon-v1.6',
    icon: Zap,
    label: 'Try-On v1.6',
    description: 'Fast & lightweight e-commerce virtual try-on.',
    to: '/tryon-v1.6',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'model-swap',
    icon: RefreshCw,
    label: 'Model Swap',
    description: 'Swap the model identity while keeping the garment.',
    to: '/swap-model',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    gradient: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'edit',
    icon: Edit3,
    label: 'Edit',
    description: 'Change poses, add accessories, and lighting.',
    to: '/edit',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'model-create',
    icon: UserCircle2,
    label: 'Create Model',
    description: 'Generate a brand-new AI fashion model from scratch.',
    to: '/create-model',
    image: 'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=400&q=80',
    gradient: 'from-pink-400 to-rose-600',
  },
  {
    id: 'face-to-model',
    icon: UserCircle2,
    label: 'Face to Model',
    description: 'Transform face images into try-on ready avatars.',
    to: '/face-to-model',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
    gradient: 'from-fuchsia-400 to-purple-600',
  },
  {
    id: 'image-to-video',
    icon: Video,
    label: 'Image to Video',
    description: 'Turn a single image into a short motion clip.',
    to: '/image-to-video',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'reframe',
    icon: Move,
    label: 'Reframe',
    description: 'Change aspect ratio and enhance image resolution.',
    to: '/reframe',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80',
    gradient: 'from-lime-400 to-green-600',
  },
  {
    id: 'bg-remove',
    icon: X,
    label: 'BG Remove',
    description: 'Remove backgrounds instantly with one click.',
    to: '/bg-remove',
    image: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400&q=80',
    gradient: 'from-gray-400 to-zinc-600',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.44, ease: 'easeOut' },
  }),
};

export function Template() {
  return (
    <div className="fash-home">
      <motion.section
        className="fash-section"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <motion.div className="fash-section-header" variants={fadeUp} custom={0}>
          <div>
            <p className="fash-greeting-eyebrow mb-1 flex items-center gap-2">
              <LayoutTemplate size={14} />
              Templates
            </p>
            <h1 className="fash-section-title" style={{ marginBottom: 0 }}>
              Start from a template
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Pick a workflow and jump straight into creation.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {TEMPLATES.map((tpl: Template, i: number) => (
            <motion.div
              key={tpl.id}
              className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              variants={fadeUp}
              custom={i + 1}
            >
              <Link to={tpl.to} className="group block cursor-pointer">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-zinc-800">
                  <img
                    src={tpl.image}
                    alt={tpl.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-800 backdrop-blur-sm dark:bg-zinc-900/90 dark:text-zinc-200">
                    {tpl.label}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 translate-y-2 transform p-4 transition-transform duration-300 group-hover:translate-y-0">
                    <span className="block text-sm font-bold text-white">{tpl.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-300">{tpl.description}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
