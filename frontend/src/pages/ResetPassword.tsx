import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirm) {
    setIsError(true);
    setMessage('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    setIsError(true);
    setMessage('Password must be at least 6 characters');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `${API_URL}/api/auth/reset-password/${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      }
    );

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(data.message || 'Password reset failed');
    }

    setIsError(false);
    setMessage('Password reset successful! Redirecting to login...');

    setTimeout(() => {
      navigate('/login');
    }, 2000);
  } catch (err: any) {
    setIsError(true);
    setMessage(err.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
        <p className="text-zinc-400 text-sm">Enter your new password below</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">New Password</label>
          <input type="password" placeholder="••••••••" required
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Confirm Password</label>
          <input type="password" placeholder="••••••••" required
            className="w-full bg-white dark:bg-[#27272a] border border-zinc-200 dark:border-white/5 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#b5652a] transition-colors"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {message && (
          <div className={`text-sm p-3 rounded-lg ${isError ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
            {message}
          </div>
        )}
        <button type="submit" disabled={loading}
          className="w-full bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white font-medium py-3 rounded-lg mt-6 transition-all disabled:opacity-50">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  );
}