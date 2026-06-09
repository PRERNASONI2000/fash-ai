//authlayout.tsx
import React from 'react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#0d0d10] text-zinc-900 dark:text-white px-4 py-12">
      <div className="w-full max-w-md px-8 py-10 rounded-2xl border border-zinc-200/80 dark:border-white/[0.07] shadow-md shadow-zinc-900/5 dark:shadow-black/40 bg-white dark:bg-[#17171b]">
        {children}
      </div>
    </div>
  );
}