// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  LayoutTemplate,
  Zap,
  RefreshCw,
  UserCircle2,
  ArrowRight,
  Clock,
  Star,
  Image as ImageIcon,
  Video,
  Edit3,
  Move,
  X,
} from 'lucide-react';
import { fetchHistory } from '../lib/fashnService'; // ✅ Import API
import { useUserData } from '../hooks/useUserData'; // ✅ Import Custom Hook

// const API_URL = import.meta.env.VITE_API_URL

// ─── Types ────────────────────────────────────────────────────────────────────
interface Template {
  id: string;
  icon: React.ElementType; 
  label: string;
  description: string;
  to: string;
  image: string; // ✅ Image added
  gradient: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

// ✅ UPDATED: Added all 10 models with images
const TEMPLATES: Template[] = [
  {
    id: 'product-to-model',
    icon: UserCircle2,
    label: 'Product to Model',
    description: 'Place your product on an AI-generated fashion model.',
    to: '/product-to-model',
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80', // Fashion model
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    id: 'tryon-max',
    icon: Sparkles,
    label: 'Try-On Max',
    description: 'Studio-grade virtual try-on with high resolution.',
    to: '/try-on',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80', // High fashion
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    id: 'tryon-v1.6',
    icon: Zap,
    label: 'Try-On v1.6',
    description: 'Fast & lightweight e-commerce virtual try-on.',
    to: '/tryon-v1.6',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', // Casual wear
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'model-swap',
    icon: RefreshCw,
    label: 'Model Swap',
    description: 'Swap the model identity while keeping the garment.',
    to: '/swap-model',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80', // Swapping pose
    gradient: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'edit',
    icon: Edit3,
    label: 'Edit',
    description: 'Change poses, add accessories, and lighting.',
    to: '/edit',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80', // Editing/Studio
    gradient: 'from-blue-400 to-indigo-600',
  },
  {
    id: 'model-create',
    icon: UserCircle2,
    label: 'Create Model',
    description: 'Generate a brand-new AI fashion model from scratch.',
    to: '/create-model',
    image: 'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=400&q=80', // AI generation vibe
    gradient: 'from-pink-400 to-rose-600',
  },
  {
    id: 'face-to-model',
    icon: UserCircle2,
    label: 'Face to Model',
    description: 'Transform face images into try-on ready avatars.',
    to: '/face-to-model',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', // Face closeup
    gradient: 'from-fuchsia-400 to-purple-600',
  },
  {
    id: 'image-to-video',
    icon: Video,
    label: 'Image to Video',
    description: 'Turn a single image into a short motion clip.',
    to: '/image-to-video',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', // Motion blur
    gradient: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'reframe',
    icon: Move,
    label: 'Reframe',
    description: 'Change aspect ratio and enhance image resolution.',
    to: '/reframe',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80', // Framing
    gradient: 'from-lime-400 to-green-600',
  },
  {
    id: 'bg-remove',
    icon: X,
    label: 'BG Remove',
    description: 'Remove backgrounds instantly with one click.',
    to: '/bg-remove',
    image: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400&q=80', // Clean cutout style
    gradient: 'from-gray-400 to-zinc-600',
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp : Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.44, ease: 'easeOut' },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────
export function Home() {
  const [userName, setUserName] = useState<string>('there');
  const [greeting, setGreeting] = useState<string>('Good morning');

  // ✅ Use the custom hook to get user data
  const { userData } = useUserData();
  
  // ✅ State for Recent Work (Real Data)
  const [recentWork, setRecentWork] = useState<any[]>([]);

  useEffect(() => {
    // Time-based greeting
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

     // ✅ Use userData from hook
    if (userData.name || userData.email) {
      const n: string = userData.name || (userData.email ? (userData.email as string).split('@')[0] : '');
      if (n) setUserName(n.split(' ')[0]);
    }
  }, [userData]);

   
  // ✅ Fetch Real Recent Work (Updated: Wait for userData to load)
  useEffect(() => {
    // Agar userData loading me hai ya null hai, toh API call mat karo
    if (!userData) return; 

    const loadRecentWork = async () => {
      try {
        const data = await fetchHistory();
        if (data.history && data.history.length > 0) {
          // Sirf latest 6 items lo aur unka flat array bana lo (images nikal lo)
          const flatItems = data.history.flatMap((item: any) => 
            item.output.map((url: string) => ({
              image: url,
              label: item.model_name?.replace(/-/g, ' ') || 'Generation'
            }))
          ).slice(0, 6); // Max 6 dikhane hain dashboard me
          
          setRecentWork(flatItems);
        }
      } catch (err) {
        console.error("Failed to load recent work");
      }
    };
    loadRecentWork();
  }, [userData]); // ✅ Dependency me userData daal diya

  return (
    <div className="fash-home">

      {/* ── WELCOME BANNER ──────────────────────────────────────────── */}
      <motion.section
        className="fash-welcome"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <div className="fash-welcome-left">
          <motion.div variants={fadeUp} custom={0}>
            <p className="fash-greeting-eyebrow">{greeting},</p>
            <h1 className="fash-greeting-name">{userName} 👋</h1>
            <p className="fash-greeting-sub">What would you like to create today?</p>
          </motion.div>
          <motion.div className="fash-cta-row" variants={fadeUp} custom={1}>
            <Link to="/generate" className="fash-btn-primary">
              <Sparkles size={16} />
              Start a generation
            </Link>
            <Link to="/generate" className="fash-btn-secondary">
              <LayoutTemplate size={16} />
              Browse templates
            </Link>
          </motion.div>
        </div>

        <motion.div className="fash-plan-card" variants={fadeUp} custom={2}>
          <div className="fash-plan-top">
            <div>
              <p className="fash-plan-eyebrow">Your Plan</p>
              <p className="fash-plan-title">Studio</p>
            </div>
            <span className="fash-plan-badge">
              <Star size={11} />
              PRO
            </span>
          </div>

          <div className="fash-plan-stats">
            <div className="fash-stat-item">
              <span className="fash-stat-num">252</span>
              <span className="fash-stat-lbl">USED</span>
            </div>
            <div className="fash-stat-divider" />
            <div className="fash-stat-item">
              <span className="fash-stat-num">18</span>
              <span className="fash-stat-lbl">THIS WEEK</span>
            </div>
            <div className="fash-stat-divider" />
            <div className="fash-stat-item">
              <span className="fash-stat-num">9</span>
              <span className="fash-stat-lbl">DAYS LEFT</span>
            </div>
          </div>

          <div className="fash-plan-progress">
            <div className="fash-progress-bar">
              <div className="fash-progress-fill" style={{ width: '50.4%' }} />
            </div>
            <div className="fash-progress-labels">
              <span>248 credits used</span>
              <span>500 total</span>
            </div>
          </div>

          <div className="fash-plan-footer">
            <Clock size={12} />
            Renews in 9 days
          </div>
        </motion.div>
      </motion.section>

      {/* ── QUICK START (UPDATED UI WITH IMAGES) ────────────────────── */}
           {/* ── TEMPLATES ───────────────────────────────────────────────── */}
      <motion.section
        className="fash-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <motion.div className="fash-section-header" variants={fadeUp} custom={0}>
          <h2 className="fash-section-title" style={{ marginBottom: 0 }}>
            Start from a template
          </h2>
          <a href="#" className="fash-see-all">
            See all <ArrowRight size={13} />
          </a>
        </motion.div>
        
        {/* ✅ Modern Flex Wrap Container */}
        <div className="flex flex-wrap gap-4 justify-center">
          {TEMPLATES.map((tpl: Template, i: number) => (
            <motion.div 
              key={tpl.id} 
              className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]" 
              variants={fadeUp} 
              custom={i + 1}
            >
              {/* ✅ LINK ADDED: Click karne par us specific route par jayega */}
              <Link to={tpl.to} className="block group cursor-pointer">
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
                  
                  {/* Image with Zoom Effect */}
                  <img 
                    src={tpl.image} 
                    alt={tpl.label} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy" 
                  />
                  
                  {/* Gradient Overlay (Always slight visible, darker on hover) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Tag (Top Right) */}
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm uppercase tracking-wider">
                    {tpl.label} {/* ✅ Tag me label dikhaya */}
                  </span>

                  {/* Content Details (Slides up on hover) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="block text-white text-sm font-bold">{tpl.label}</span>
                    <span className="block text-zinc-300 text-xs mt-0.5">
                      {tpl.description} {/* ✅ Neeche description dikhaya */}
                    </span>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── TEMPLATES (REMOVED AS PER REQUEST - Can add back if needed) ── */}

      {/* ── RECENT WORK (REAL API DATA) ─────────────────────────────── */}
      <motion.section
        className="fash-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div className="fash-section-header" variants={fadeUp} custom={0}>
          <h2 className="fash-section-title" style={{ marginBottom: 0 }}>
            Recent work
          </h2>
          <Link to="/gallery" className="fash-see-all">
            View all <ArrowRight size={13} />
          </Link>
        </motion.div>

        
        {recentWork.length > 0 ? (
          <div className="fash-recent-grid">
            {recentWork.map((item: any, i: number) => {
              const isVideo = item.image.endsWith('.mp4');
              return (
                <motion.div key={i} className="fash-recent-card" variants={fadeUp} custom={i + 1}>
                  {isVideo ? (
                    <video src={item.image} className="fash-recent-img" muted />
                  ) : (
                    <img src={item.image} alt={item.label} className="fash-recent-img" loading="lazy" />
                  )}
                  <div className="fash-recent-overlay">
                    <span className="fash-recent-label">{item.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl">
            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No recent work yet</p>
            <p className="text-xs mt-1">Start generating to see your creations here!</p>
          </div>
        )}
      </motion.section>

    </div>
  );
}