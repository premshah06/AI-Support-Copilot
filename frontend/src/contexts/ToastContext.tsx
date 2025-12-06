import React, { createContext, useContext } from 'react';
import toast, { Toaster, Toast as HotToast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  dismissToast: (toastId: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Custom toast component with variants and progress bar
 */
const CustomToast: React.FC<{ t: HotToast; message: string; type: ToastType; duration: number }> = ({
  t,
  message,
  type,
  duration,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="relative">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 animate-[scale-in_0.3s_ease-out]" />
          </div>
        );
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 dark:bg-green-400';
      case 'error':
        return 'bg-red-500 dark:bg-red-400';
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'info':
        return 'bg-blue-500 dark:bg-blue-400';
      default:
        return 'bg-gray-500 dark:bg-gray-400';
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
        ${getBackgroundColor()}
        ${t.visible ? 'animate-enter' : 'animate-leave'}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-700 w-full"
        aria-hidden="true"
      >
        <div
          className={`h-full ${getProgressColor()} transition-all ease-linear`}
          style={{
            width: t.visible ? '0%' : '100%',
            transitionDuration: t.visible ? `${duration}ms` : '0ms',
          }}
        />
      </div>
    </div>
  );
};

/**
 * ToastProvider component that manages toast notifications
 * 
 * Provides toast context to all child components and handles:
 * - Displaying toast notifications with different variants
 * - Auto-dismiss with configurable duration
 * - Animations (slide-in, fade-out)
 * - Accessible notifications with ARIA attributes
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = (message: string, type: ToastType = 'info', duration: number = 4000) => {
    toast.custom(
      (t) => <CustomToast t={t} message={message} type={type} duration={duration} />,
      {
        duration,
        position: 'top-right',
      }
    );
  };

  const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
  };

  const value: ToastContextValue = {
    showToast,
    dismissToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
          },
        }}
      />
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to access toast context
 * 
 * @returns ToastContextValue with showToast and dismissToast functions
 * @throws Error if used outside of ToastProvider
 * 
 * @example
 * const { showToast } = useToast();
 * 
 * const handleSuccess = () => {
 *   showToast('Operation completed successfully!', 'success');
 * };
 * 
 * const handleError = () => {
 *   showToast('Something went wrong', 'error', 5000);
 * };
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
