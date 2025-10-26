export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-muted-foreground text-sm border-t">
      © {currentYear} WebIntel. All Rights Reserved. Developed by Fortune.
    </footer>
  );
}
