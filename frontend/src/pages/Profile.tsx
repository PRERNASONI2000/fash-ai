//profile.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load profile');
        }
        setEmail(data.email || '');
        setName(data.name || '');
      } catch (err: any) {
        setError(err.message || 'Unable to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to save profile');
      }
      setName(data.user?.name || name);
      setSuccess('Profile saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Unable to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const handleManageSubscription = () => {
    navigate('/subscriptions');
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setError('');
    setIsDeleting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete account');
      }
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Unable to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const avatarLetter = email?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-zinc-900 dark:text-white">
      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 dark:border-white/10 border-t-violet-500" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-3 shadow-md shadow-violet-500/25">
              <span className="text-3xl font-bold text-white">{avatarLetter}</span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Profile avatar based on your email</p>
          </div>

          <div className="space-y-4">
            {error && <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div>}
            {success && <div className="rounded-xl border border-green-500/20 bg-green-50 dark:bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-300">{success}</div>}

            <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Personal Info</h3>

              <div>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-zinc-400 dark:text-zinc-500 focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-700 dark:hover:bg-zinc-100 text-white dark:text-black font-semibold py-2.5 rounded-xl transition-colors shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Account</h3>

              <button
                type="button"
                onClick={handleManageSubscription}
                className="w-full flex items-center justify-between bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/[0.07] text-zinc-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-all text-sm"
              >
                Manage Subscription
                <span className="text-zinc-400 text-base">→</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-between bg-zinc-50 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.07] hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-100 dark:hover:bg-white/[0.07] text-zinc-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-all text-sm"
              >
                Sign Out
                <span className="text-zinc-400 text-base">→</span>
              </button>
            </div>

            <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50/60 dark:bg-red-500/[0.04] p-6 shadow-sm">
              <h3 className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">Permanently delete your account and all associated data. This cannot be undone.</p>
              <button
                type="button"
                onClick={openDeleteModal}
                disabled={isDeleting}
                className="w-full border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting account...' : 'Delete My Account'}
              </button>
            </div>
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6">
              <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0F0F14] p-8 text-zinc-900 dark:text-white shadow-2xl shadow-red-900/20">

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="absolute top-4 right-4 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 p-1.5 text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-white/10 hover:text-zinc-600 dark:hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Icon & Header */}
                <div className="flex flex-col items-center text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.2)] mb-5">
                    <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">Delete Your Account?</h2>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    This action is permanent and cannot be undone. All your data, images, and settings will be permanently removed.
                  </p>
                </div>

                {/* Danger Warning Box */}
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300 flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">You will lose all your data forever. Proceed with extreme caution.</span>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:from-red-500 hover:to-rose-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </button>
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-4 py-3.5 font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-200 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
