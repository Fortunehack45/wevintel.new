<<<<<<< HEAD
<<<<<<< HEAD

import { ReactNode } from 'react';
=======
import { Sidebar } from "@/components/sidebar";
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======

import { ReactNode } from 'react';
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)

export default function HistoryLayout({
  children,
}: {
<<<<<<< HEAD
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
=======
  children: ReactNode;
}) {
  return <>{children}</>;
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
}
