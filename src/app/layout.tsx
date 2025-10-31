
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { AppLayout } from '@/components/app-layout';
import { FirebaseProvider } from '@/firebase/client-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'WebIntel',
  description: 'Analyse any website URL for a full public intelligence report.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning className="h-full">
      <body className={cn(
          `${poppins.variable} font-body antialiased h-full`,
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseProvider>
            <div className="flex flex-col h-full">
                <AppLayout>
                    {children}
                </AppLayout>
            </div>
          </FirebaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
