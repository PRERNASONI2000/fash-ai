//frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// @ts-ignore
import { auth } from '../firebase';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }
      console.log('Google login successful');
      localStorage.setItem('token', data.token);
      setMessage('Sign in successful! Redirecting...');
      setIsSuccess(true);
      setShowModal(true);
      setIsLoading(false);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Something went wrong. Please try again.');
      setIsSuccess(false);
      setShowModal(true);
      setIsLoading(false);
    } 
  };

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

      localStorage.setItem('token', data.token);
      setMessage('Sign in successful! Redirecting...');
      setIsSuccess(true);
      setShowModal(true);
      setIsLoading(false);
      setTimeout(() => navigate('/'), 2000);
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
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-lg mt-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-50 dark:bg-[#18181b] px-2 text-zinc-400 dark:text-zinc-500">OR</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-zinc-100 dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-[#3f3f46] text-zinc-900 dark:text-white font-medium py-3 rounded-lg mt-6 transition-colors border border-zinc-200 dark:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        {isLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Don't have an account? <Link to="/signup" className="text-[#b5652a] hover:text-[#d97a40] font-medium">Sign up</Link>
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
    </AuthLayout>
  );
}