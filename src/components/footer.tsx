export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-muted-foreground text-sm border-t border-white/10">
      Powered by Next.js, Vercel, and public APIs. &copy; {currentYear} WebIntel. All rights reserved.
    </footer>
  );
}
