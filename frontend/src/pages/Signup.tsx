//frontend/src/pages/Signup.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// @ts-ignore
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function Signup() {
  const [name, setName] = useState('');
  //add loading state if you want same as login.tsx page
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const agencyRef = searchParams.get('ref') || '';

  //login with google functionality
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      //get token from user
      const token = await user.getIdToken();
      //send token to backend
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token, ...(agencyRef && { ref: agencyRef }) })
      });
      const data = await response.json();
      console.log('Google signup successful');
      localStorage.setItem('token', data.token);
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...(agencyRef && { ref: agencyRef }) })
      });
      // BUG: No error check — data.token is undefined if request fails
      const data = await response.json();
      // console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');

      }

      localStorage.setItem('token', data.token);
      setShowSuccess(true);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Welcome Aboard!</h2>
            <p className="text-zinc-400 text-sm mb-8">
              Your account has been successfully created. You're all set to start generating.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-xl transition-all shadow-[0_3px_14px_rgba(181,101,42,0.3)] hover:shadow-[0_6px_20px_rgba(181,101,42,0.45)]"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-zinc-400 text-sm">Sign up and generate for free</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>


        <div>
          <label className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-lg mt-6 transition-all"
        >
          Continue
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
        // onClick={() => alert('Google Sign-in coming soon!')}
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 bg-zinc-100 dark:bg-[#27272a] hover:bg-zinc-200 dark:hover:bg-[#3f3f46] text-zinc-900 dark:text-white font-medium py-3 rounded-lg mt-6 transition-colors border border-zinc-200 dark:border-white/5"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Already have an account? <Link to="/login" className="text-[#b5652a] hover:text-[#d97a40] font-medium">Sign in</Link>
      </div>
    </AuthLayout>
  );
}
