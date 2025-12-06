import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Keyboard } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ThemeToggle } from '../atoms/ThemeToggle';
import { useKeyboardShortcuts } from '../../contexts/KeyboardShortcutsContext';

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

/**
 * DashboardHeader component displays the application header
 * with logo, theme toggle, and optional user menu
 * 
 * Features:
 * - App logo/title
 * - Theme toggle button
 * - Optional user menu dropdown
 * - Mobile hamburger menu button
 * - Responsive design
 */
export const DashboardHeader = ({ 
  onMobileMenuToggle, 
  mobileMenuOpen = false 
}: DashboardHeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { showHelp } = useKeyboardShortcuts();

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Title - Clickable */}
        <Link 
          to="/tickets"
          className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-shadow"
          aria-label="Go to tickets page"
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-accent">
              <span className="text-base sm:text-lg font-bold text-accent-foreground">AI</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary lg:text-2xl">
              <span className="hidden sm:inline">Incident Copilot</span>
              <span className="sm:hidden">Copilot</span>
            </h1>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={showHelp}
            icon={<Keyboard size={18} />}
            aria-label="Show keyboard shortcuts"
          />
          <ThemeToggle />
          
          {/* Optional User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleUserMenu}
              icon={<User size={18} />}
              aria-label="User menu"
              aria-expanded={userMenuOpen}
            >
              Agent
            </Button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <>
                  {/* Backdrop for closing menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Profile
                      </a>
                      <a
                        href="/settings"
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </a>
                      <div className="my-1 h-px bg-border" />
                      <button
                        className="w-full rounded-md px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              icon={mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            />
          )}
        </div>
      </div>
    </header>
  );
};
