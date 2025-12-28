/**
 * ToastContext - Professional Toast Notification System
 *
 * Provides a clean and consistent toast notification system across the Host web app.
 * Uses the green Workside theme for styling.
 * Replaces SweetAlert2 dialogs with native React toasts.
 *
 * @module contexts/ToastContext
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Toast types with associated styling
const TOAST_TYPES = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  warning: {
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  loading: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
    icon: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    ),
  },
};

const ToastContext = createContext(undefined);

/**
 * Toast component that renders individual toast notifications
 */
const Toast = ({ toast, onDismiss }) => {
  const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
  const [progress, setProgress] = useState(100);
  const progressInterval = useRef(null);

  // Progress bar for loading toasts
  useEffect(() => {
    if (toast.type !== 'loading' || toast.duration <= 0) {
      return undefined;
    }

    const startTime = Date.now();
    const totalDuration = toast.duration;

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(progressInterval.current);
      }
    }, 50);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [toast.type, toast.duration]);

  return (
    <div
      className={`
        flex flex-col rounded-lg shadow-lg border-l-4 overflow-hidden
        ${config.bgColor} ${config.borderColor}
        transform transition-all duration-300 ease-out
        animate-slide-in
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={`text-sm font-semibold ${config.textColor}`}>
              {toast.title}
            </p>
          )}
          <p className={`text-sm ${config.textColor} ${toast.title ? 'mt-1' : ''}`}>
            {toast.message}
          </p>
        </div>
        {toast.type !== 'loading' && (
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {toast.type === 'loading' && toast.duration > 0 && (
        <div className="h-1 bg-green-200">
          <div
            className="h-full bg-green-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * ToastContainer component that holds all active toasts
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toastItem) => (
        <div key={toastItem.id} className="pointer-events-auto">
          <Toast toast={toastItem} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

/**
 * ToastProvider component that provides toast functionality to the app
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();

    const newToast = {
      id,
      type,
      title,
      message,
      duration, // Include duration for progress bar
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  // Convenience methods - memoized to prevent context value changing every render
  const toastMethods = useMemo(() => ({
    success: (message, title = 'Success') => showToast({ type: 'success', title, message }),
    error: (message, title = 'Error') => showToast({ type: 'error', title, message }),
    warning: (message, title = 'Warning') => showToast({ type: 'warning', title, message }),
    info: (message, title = 'Info') => showToast({ type: 'info', title, message }),
    loading: (message, title = 'Processing', duration = 3000) => showToast({ type: 'loading', title, message, duration }),
    show: showToast,
    dismiss: dismissToast,
    dismissAll: () => setToasts([]),
  }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

/**
 * Hook to use the toast system
 * @returns Toast methods: success, error, warning, info, loading, show, dismiss, dismissAll
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
