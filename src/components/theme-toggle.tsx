
'use client';

import * as React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <div className="h-10 w-[132px] animate-pulse rounded-full bg-muted" />
    );
  }

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'system', icon: Laptop },
    { name: 'dark', icon: Moon },
  ];

  return (
    <div className="relative flex items-center rounded-full border bg-card/80 p-1 shadow-sm">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className={cn(
            'relative flex h-8 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            { 'text-foreground': theme === t.name }
          )}
          aria-label={`Switch to ${t.name} theme`}
        >
          <t.icon className="h-5 w-5" />
        </button>
      ))}
      <AnimatePresence>
        {theme && (
          <motion.div
            layoutId="theme-toggle-highlight"
            className="absolute left-1 top-1 h-8 w-10 rounded-full bg-background shadow-md"
            style={{
                transform: `translateX(${themes.findIndex((t) => t.name === theme) * 100}%)`,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            initial={false}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
