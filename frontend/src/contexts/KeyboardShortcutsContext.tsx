import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { KeyboardShortcutsHelp, ShortcutDefinition } from '../components/molecules';

interface KeyboardShortcutsContextValue {
  showHelp: () => void;
  hideHelp: () => void;
  isHelpOpen: boolean;
  shortcuts: ShortcutDefinition[];
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | undefined>(
  undefined
);

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
};

interface KeyboardShortcutsProviderProps {
  children: ReactNode;
}

export const KeyboardShortcutsProvider = ({ children }: KeyboardShortcutsProviderProps) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showHelp = () => setIsHelpOpen(true);
  const hideHelp = () => setIsHelpOpen(false);

  // Define all global shortcuts
  const shortcuts: ShortcutDefinition[] = [
    {
      key: 'Ctrl + K',
      description: 'Focus search',
      category: 'Navigation',
    },
    {
      key: 'Escape',
      description: 'Close modal or dialog',
      category: 'Navigation',
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      category: 'Help',
    },
    {
      key: 'Ctrl + /',
      description: 'Show keyboard shortcuts',
      category: 'Help',
    },
  ];

  // Register global keyboard shortcuts
  useKeyboardShortcut([
    {
      key: 'k',
      ctrlKey: true,
      description: 'Focus search',
      action: () => {
        // Focus search input if on tickets page
        if (location.pathname === '/tickets') {
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[type="text"][placeholder*="Search"]'
          );
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        } else {
          // Navigate to tickets page if not already there
          navigate('/tickets');
        }
      },
    },
    {
      key: 'Escape',
      description: 'Close modal or dialog',
      action: () => {
        // Close help modal if open
        if (isHelpOpen) {
          hideHelp();
        }
        // Blur active element (useful for closing dropdowns, etc.)
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      },
    },
    {
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts',
      action: showHelp,
    },
    {
      key: '/',
      ctrlKey: true,
      description: 'Show keyboard shortcuts (alternative)',
      action: showHelp,
    },
  ]);

  const value: KeyboardShortcutsContextValue = {
    showHelp,
    hideHelp,
    isHelpOpen,
    shortcuts,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
      <KeyboardShortcutsHelp
        isOpen={isHelpOpen}
        onClose={hideHelp}
        shortcuts={shortcuts}
      />
    </KeyboardShortcutsContext.Provider>
  );
};
