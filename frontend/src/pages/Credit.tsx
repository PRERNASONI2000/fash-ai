
import { History } from 'lucide-react';

export function Credit() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-zinc-900 dark:text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">Credits History</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View your credit usage over time.</p>
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] shadow-sm p-16 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-zinc-100 dark:bg-white/[0.06] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <History className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No credit activity yet</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Your usage will appear here once you start generating.</p>
      </div>
    </div>
  );
}