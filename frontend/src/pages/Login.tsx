//frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// @ts-ignore
// import { auth } from '../firebase';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const HERO_FEATURES = [
  'Virtual Try-On Studio',
  'AI-Powered Model Generation',
  'Product to Model Instantly',
  'Launch Fashion Campaigns Without a Studio',
] as const;

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // localStorage.setItem('token', data.token);
      await login(data.token);
      setMessage('Sign in successful! Redirecting...');
      setIsSuccess(true);
      setShowModal(true);
      setIsLoading(false);
      // setTimeout(() => navigate('/'), 2000);
      //Iski wajah se 2 second tak modal khula rehta hai aur profile fetch background me hoti rehti hai.
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Something went wrong. Please try again.');
      setIsSuccess(false);
      setShowModal(true);
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f2eee6] dark:bg-zinc-950">
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* ── Left hero panel ─────────────────────────────────────────── */}
        <div className="relative hidden min-h-screen w-full flex-col justify-between bg-gradient-to-br from-[#1a1410] via-[#2d1f14] to-[#3d2818] px-6 py-8 lg:flex lg:w-1/2 lg:overflow-y-auto lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#b5652a]/25 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#d97a40]/20 blur-3xl" />
            <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-amber-400/10 blur-2xl" />
          </div>

          <div className="relative z-10 shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
              <Star size={12} className="text-[#f5e4d6]" />
              AI Powered Fashion Studio
            </span>

            <h1 className="mt-6 max-w-lg text-3xl font-bold leading-tight text-white xl:text-4xl">
              Create faster. Style smarter.
              <span className="mt-1 block bg-gradient-to-r from-[#f5e4d6] to-[#d97a40] bg-clip-text text-transparent">
                Scale with AI.
              </span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#f5e4d6]/85 xl:text-base">
              Generate fashion models, virtual try-ons, and campaign-ready visuals with guided AI workflows from one workspace.
            </p>
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 items-end pt-6">
            <motion.div
              className="relative w-full max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
                alt="Fashion AI workspace preview"
                className="h-[min(32vh,260px)] w-full rounded-2xl border border-white/10 object-cover shadow-2xl shadow-black/30 xl:h-[min(36vh,300px)]"
                animate={{ opacity: [1, 0.88, 1] }}
                transition={{
                  duration: 3.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: 0.9,
                }}
              />

              <div className="pointer-events-none absolute inset-0">
                {HERO_FEATURES.map((feature, index) => {
                  const positions = [
                    'left-[2%] top-[6%]',
                    'right-[2%] top-[14%]',
                    'left-[4%] bottom-[10%]',
                    'right-[3%] bottom-[4%]',
                  ] as const;

                  return (
                    <div
                      key={feature}
                      className={`absolute ${positions[index]} max-w-[150px] rounded-full border border-white/15 bg-[#8c4a1c]/85 px-2.5 py-1.5 text-center text-[10px] font-medium leading-snug text-white shadow-lg backdrop-blur-sm xl:max-w-[165px] xl:text-[11px]`}
                    >
                      {feature}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Right login panel ───────────────────────────────────────── */}
        <div className="flex min-h-screen w-full flex-1 items-center justify-center px-6 py-8 lg:w-1/2 lg:overflow-y-auto lg:px-10">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/60 dark:border-white/10 dark:bg-[#1e1e1e] dark:shadow-black/20 lg:p-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#b5652a] to-[#d97a40] shadow-lg shadow-[rgba(181,101,42,0.35)]">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Fash<span className="text-[#b5652a] dark:text-[#d97a40]">AI</span>
                </span>
              </div>

              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to start creating fashion visuals with AI
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:border-[#b5652a] focus:outline-none focus:ring-2 focus:ring-[#b5652a]/20 dark:border-white/10 dark:bg-[#27272a] dark:text-white dark:placeholder:text-zinc-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-12 text-zinc-900 placeholder:text-zinc-400 focus:border-[#b5652a] focus:outline-none focus:ring-2 focus:ring-[#b5652a]/20 dark:border-white/10 dark:bg-[#27272a] dark:text-white dark:placeholder:text-zinc-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 transition-colors hover:text-[#b5652a]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] py-3.5 font-semibold text-white shadow-lg shadow-[rgba(181,101,42,0.35)] transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#b5652a] transition-colors hover:text-[#d97a40] dark:text-[#d97a40] dark:hover:text-[#f59e67]"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      
      {/* Success/Error Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className={`bg-white dark:bg-zinc-900 border-2 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl ${isSuccess ? 'border-green-500/50' : 'border-red-500/50'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20'}`}>
                <span className={`text-lg ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isSuccess ? '✓' : '✕'}
                </span>
              </div>
              <h2 className={`text-lg font-semibold ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isSuccess ? 'Success' : 'Error'}
              </h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-6">{message}</p>
            <button
              onClick={closeModal}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${isSuccess
                  ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30'
                  : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30'
                }`}
            >
              {isSuccess ? 'Continue' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
