import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { BottomNav } from '@/components/bottom-nav';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'WebIntel',
  description: 'Analyze any website URL for a full public intelligence report.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          `${poppins.variable} font-body antialiased`,
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <div className="wave-container">
            <div className="wave-light"></div>
          </div>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 pb-24 md:pb-12 pt-28">{children}</main>
            <Footer />
          </div>
          <BottomNav />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
