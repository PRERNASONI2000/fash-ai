
import { History } from 'lucide-react';

export function Credit() {
  return (
    <div className="max-w-2xl mx-auto py-12 text-zinc-900 dark:text-white">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-200 dark:border-white/10">
          <History className="w-8 h-8 text-zinc-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Credits History</h1>
        <p className="text-zinc-400">View your credit usage over time.</p>
      </div>
      <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/10 rounded-2xl p-8 text-center">
        <p className="text-zinc-500">No recent credit activity.</p>
      </div>
    </div>
  );
}