
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Info, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Send },
];

export function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t md:hidden z-50"
    >
      <nav className="flex h-full items-center justify-around">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={link.label}
            >
              <link.icon className="h-6 w-6" />
              <span className="text-xs">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
