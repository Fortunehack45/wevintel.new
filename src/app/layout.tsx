
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
    <html lang="en-GB" suppressHydrationWarning>
      <body className={cn(
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
          `${poppins.variable} font-body antialiased flex flex-col min-h-screen`,
=======
          `${poppins.variable} font-body antialiased h-full`,
>>>>>>> ad66bd8 (The footer should be separated from the body in the desktop view. Like t)
=======
          `${poppins.variable} font-body antialiased`,
>>>>>>> 980974b (Remove that footer been separate features and keep it the way it was bef)
=======
          `${poppins.variable} font-body antialiased flex flex-col min-h-screen`,
>>>>>>> 0c78a9c (Error: A tree hydrated but some attributes of the server rendered HTML d)
        )}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseProvider>
<<<<<<< HEAD
<<<<<<< HEAD
            <AppLayout>
                {children}
            </AppLayout>
=======
            <div className="flex flex-col h-full">
                <AppLayout>
                    {children}
                </AppLayout>
            </div>
>>>>>>> ad66bd8 (The footer should be separated from the body in the desktop view. Like t)
=======
            <AppLayout>
                {children}
            </AppLayout>
>>>>>>> 980974b (Remove that footer been separate features and keep it the way it was bef)
          </FirebaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
