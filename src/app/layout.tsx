import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Poppins } from 'next/font/google';

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
    <html lang="en">
      <body className={`${poppins.variable} font-body antialiased bg-gray-50 text-foreground`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
