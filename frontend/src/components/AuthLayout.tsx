//authlayout.tsx
import React from 'react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-zinc-900 dark:text-white">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl bg-white dark:bg-[#1e1e1e]">
        {children}
      </div>
    </div>
  );
}