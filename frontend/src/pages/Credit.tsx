// src/pages/Credit.tsx
import { History, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { useUserData } from '../hooks/useUserData';

// ✅ Backend aaye ga toh ye interface use hoga
interface CreditLog {
  _id: string;
  planName: string;
  credits: number;
  type: 'deduction' | 'purchase' | 'bonus';
  createdAt: string;
}

export function Credit() {
  // ✅ Real API se data fetch kar rahe hain
  const { data: history, loading } = useFetch<CreditLog[]>(`${import.meta.env.VITE_API_URL}/api/credits/history`);
  
  // ✅ Current Balance ke liye userdata
  const { userData } = useUserData();

  // ✅ Stats Calculate kar rahe hain dynamic data se
  const totalSpent = history?.filter(log => log.credits < 0).reduce((acc, curr) => acc + Math.abs(curr.credits), 0) || 0;
  const totalAdded = history?.filter(log => log.credits > 0).reduce((acc, curr) => acc + curr.credits, 0) || 0;
  const currentBalance = userData?.credits || 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-zinc-900 dark:text-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Credits History</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Track where and how you spent your credits.</p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-red-500">{totalSpent}</p>
        </div>
        <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Total Added</p>
          <p className="text-2xl font-bold text-emerald-500">{totalAdded}</p>
        </div>
        <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-xl p-4">
          <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Current Balance</p>
          <p className="text-2xl font-bold text-[#d97a40]">{currentBalance}</p>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">
          <h2 className="font-semibold text-sm">Recent Activity</h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#d97a40] mb-3" />
            <p className="text-zinc-500 text-sm">Loading activity...</p>
          </div>
        ) : !history || history.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 border border-zinc-200 dark:border-white/10">
              <History className="w-8 h-8 text-zinc-400" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No recent credit activity.</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-1">Credits used or added will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/5">
            {history.map((log) => (
              <div key={log._id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${log.credits < 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {log.credits < 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{log.planName}</p>
                    <p className="text-xs text-zinc-400">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${log.credits < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {log.credits < 0 ? '' : '+'}{log.credits}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}