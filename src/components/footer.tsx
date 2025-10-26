export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-muted-foreground text-sm border-t border-border/40">
      Powered by Next.js, Firebase, and cutting-edge AI. &copy; {currentYear} Web Insights.
    </footer>
  );
}
