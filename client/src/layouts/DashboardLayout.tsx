import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200 selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)]">
      {/* Main app top bar */}
      <Navbar
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        isMobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-xs z-20 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Pane */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--border-default)] bg-[var(--bg-page)]/80 py-4 px-6 text-center text-xs text-[var(--text-secondary)] mt-auto">
        <p>© 2026 NodalConnector. Talent & Industry Collaboration Platform.</p>
      </footer>
    </div>
  );
};
