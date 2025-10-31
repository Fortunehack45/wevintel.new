<<<<<<< HEAD

import { ReactNode } from 'react';
=======
import { Sidebar } from "@/components/sidebar";
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)

export default function CompareLayout({
  children,
}: {
<<<<<<< HEAD
  children: ReactNode;
}) {
  return <>{children}</>;
=======
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 md:pl-64 h-full">
        {children}
      </main>
    </div>
  );
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
}
