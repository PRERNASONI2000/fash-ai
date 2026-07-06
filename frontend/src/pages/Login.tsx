//frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// @ts-ignore
// import { auth } from '../firebase';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    <div className="relative min-h-screen overflow-hidden bg-[#ebe6df] dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#b5652a]/55 blur-[100px]" />
        <div className="absolute top-1/4 -right-24 h-[32rem] w-[32rem] rounded-full bg-[#d97a40]/45 blur-[120px]" />
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-amber-400/35 blur-[90px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf7f2]/80 via-[#f3ebe3]/60 to-[#e8dfd4]/80 dark:from-zinc-950/90 dark:via-[#1a1410]/80 dark:to-zinc-900/90" />
      </div>

      <div className="relative z-10 [&>div]:min-h-screen [&>div>div]:bg-white [&>div>div]:dark:bg-[#1e1e1e] [&>div>div]:shadow-2xl [&>div>div]:border [&>div>div]:border-white/60 [&>div>div]:dark:border-white/10">
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-400 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm text-zinc-400">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#b5652a] hover:text-[#d97a40]">Forgot password?</Link>
          </div>
         <div className="relative">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="••••••••"
    className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 pr-12 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-500 hover:text-[#b5652a] transition-colors"
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-lg mt-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      
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
    </AuthLayout>
      </div>
    </div>
  );
}