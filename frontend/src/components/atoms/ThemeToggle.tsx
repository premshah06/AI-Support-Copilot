import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

/**
 * ThemeToggle component that allows users to switch between light and dark themes
 * 
 * Displays a sun icon in dark mode and moon icon in light mode
 * Uses the useTheme hook to access and toggle the current theme
 */
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </Button>
  );
};
