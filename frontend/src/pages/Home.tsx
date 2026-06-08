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
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuickStartCard {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
  gradient: string;
}

interface Template {
  id: number;
  tag: string;
  title: string;
  ratio: string;
  uses: string;
  image: string;
}

interface RecentItem {
  id: number;
  image: string;
  label: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const QUICK_START_CARDS: QuickStartCard[] = [
  {
    id: 'product-to-model',
    icon: UserCircle2,
    label: 'Product to Model',
    description: 'Place your product on an AI-generated fashion model.',
    to: '/generate',
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    id: 'try-on',
    icon: Sparkles,
    label: 'Try On',
    description: 'Virtually dress a model in any garment you upload.',
    to: '/generate',
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    id: 'create-model',
    icon: Zap,
    label: 'Create Model',
    description: 'Generate a brand-new AI fashion model from scratch.',
    to: '/generate',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'swap-model',
    icon: RefreshCw,
    label: 'Swap Model',
    description: 'Swap the model in any existing fashion image instantly.',
    to: '/generate',
    gradient: 'from-teal-400 to-emerald-600',
  },
];

const TEMPLATES: Template[] = [
  {
    id: 1,
    tag: 'LIFESTYLE',
    title: 'Porcelain Beauty',
    ratio: '4:5',
    uses: '4.0k',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027614a8?w=600&q=80',
  },
  {
    id: 2,
    tag: 'STUDIO',
    title: 'Sunlit Linen',
    ratio: '1:1',
    uses: '3.2k',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    id: 3,
    tag: 'EDITORIAL',
    title: 'Concrete Muse',
    ratio: '3:4',
    uses: '2.8k',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  },
  {
    id: 4,
    tag: 'LIFESTYLE',
    title: 'Golden Hour',
    ratio: '4:5',
    uses: '5.1k',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  },
  {
    id: 5,
    tag: 'STUDIO',
    title: 'Midnight Glam',
    ratio: '1:1',
    uses: '1.9k',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  },
  {
    id: 6,
    tag: 'EDITORIAL',
    title: 'Desert Bloom',
    ratio: '3:4',
    uses: '3.5k',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80',
  },
];

const RECENT_WORK: RecentItem[] = [
  { id: 1, image: 'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=500&q=80', label: 'Summer Collection' },
  { id: 2, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=80', label: 'Urban Essentials' },
  { id: 3, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80', label: 'Street Style' },
  { id: 4, image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80', label: 'Boho Chic' },
  { id: 5, image: 'https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=500&q=80', label: 'Minimalist Look' },
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

  useEffect(() => {
    // Time-based greeting — pure UI logic
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Read name from existing auth token — no new auth logic added
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const n: string = data.name || (data.email ? (data.email as string).split('@')[0] : '');
        if (n) setUserName(n.split(' ')[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="fash-home">

      {/* ── WELCOME BANNER ──────────────────────────────────────────── */}
      <motion.section
        className="fash-welcome"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Left: greeting + CTAs */}
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

        {/* Right: Studio Plan widget */}
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

      {/* ── QUICK START ─────────────────────────────────────────────── */}
      <motion.section
        className="fash-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.h2 className="fash-section-title" variants={fadeUp} custom={0}>
          Quick start
        </motion.h2>
        <div className="fash-qs-grid">
          {QUICK_START_CARDS.map((card: QuickStartCard, i: number) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.id} variants={fadeUp} custom={i + 1}>
                <Link to={card.to} className="fash-qs-card">
                  <div className={`fash-qs-icon-wrap bg-gradient-to-br ${card.gradient}`}>
                    <Icon size={19} color="white" strokeWidth={2} />
                  </div>
                  <div className="fash-qs-text">
                    <span className="fash-qs-label">{card.label}</span>
                    <span className="fash-qs-desc">{card.description}</span>
                  </div>
                  <ArrowRight size={15} className="fash-qs-arrow" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── TEMPLATES ───────────────────────────────────────────────── */}
      <motion.section
        className="fash-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      >
        <motion.div className="fash-section-header" variants={fadeUp} custom={0}>
          <h2 className="fash-section-title" style={{ marginBottom: 0 }}>
            Start from a template
          </h2>
          <a href="#" className="fash-see-all">
            See all <ArrowRight size={13} />
          </a>
        </motion.div>
        <div className="fash-templates-grid">
          {TEMPLATES.map((tpl: Template, i: number) => (
            <motion.div key={tpl.id} className="fash-tpl-card" variants={fadeUp} custom={i + 1}>
              <div className="fash-tpl-img-wrap">
                <img src={tpl.image} alt={tpl.title} className="fash-tpl-img" loading="lazy" />
                <span className="fash-tpl-tag">{tpl.tag}</span>
              </div>
              <div className="fash-tpl-body">
                <span className="fash-tpl-title">{tpl.title}</span>
                <span className="fash-tpl-meta">
                  {tpl.ratio} · {tpl.uses} uses
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── RECENT WORK ─────────────────────────────────────────────── */}
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
          <a href="#" className="fash-see-all">
            View all <ArrowRight size={13} />
          </a>
        </motion.div>
        <div className="fash-recent-grid">
          {RECENT_WORK.map((item: RecentItem, i: number) => (
            <motion.div key={item.id} className="fash-recent-card" variants={fadeUp} custom={i + 1}>
              <img src={item.image} alt={item.label} className="fash-recent-img" loading="lazy" />
              <div className="fash-recent-overlay">
                <span className="fash-recent-label">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
