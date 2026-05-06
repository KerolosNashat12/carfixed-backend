import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export const AppLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-900 text-ink-50 flex">
      {/* Background atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-plum/5 blur-3xl" />
      </div>

      <Sidebar />
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 relative z-10">
        <Header
          onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
          mobileNavOpen={mobileNavOpen}
        />
        <main className="px-4 lg:px-8 py-6 lg:py-10 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
