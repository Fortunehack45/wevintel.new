export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-muted-foreground text-sm border-t">
      Powered by Next.js and public APIs. &copy; {currentYear} WebIntel. All rights reserved.
    </footer>
  );
}
