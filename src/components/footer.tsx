
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center text-muted-foreground text-sm border-t">
      © {currentYear} WebIntel. All Rights Reserved. Developed by{' '}
      <a href="https://wa.me/2349167689200" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        Fortune
      </a>.
    </footer>
  );
}

    