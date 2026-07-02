//forgotpassword.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

const API_URL = import.meta.env.VITE_API_URL;

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);


  //settimeout to clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  //handle submit function to send reset password link to user's email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      setIsError(false);
      setMessage('Reset link sent to your email');
      //development testing
      // if (data.resetUrl) {
      //   setMessage(`Reset link: ${data.resetUrl}`);
      // }
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-zinc-400 text-sm">Enter your email to receive a reset link</p>
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-lg mt-6 transition-all"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-400">
        Remember your password? <Link to="/login" className="text-[#b5652a] hover:text-[#d97a40] font-medium">Sign in</Link>
      </div>
      {message && <div className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</div>}
    </AuthLayout>
  );
}