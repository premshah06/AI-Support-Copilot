import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout component provides the main application layout structure
 * with a responsive header and mobile hamburger menu
 * 
 * Features:
 * - Responsive header with app branding
 * - Mobile hamburger menu with slide-in drawer
 * - Theme toggle integration
 * - Smooth animations for mobile menu
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background transition-theme">
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <DashboardHeader 
        onMobileMenuToggle={toggleMobileMenu}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-64 bg-card shadow-xl border-l border-border md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-muted/50">
                <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileMenu}
                  icon={<X size={20} />}
                  aria-label="Close menu"
                />
              </div>

              <nav className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor and triage active tickets with AI assistance.
                  </p>
                  
                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <a
                      href="/tickets"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Tickets
                    </a>
                    <a
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Settings
                    </a>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
};
