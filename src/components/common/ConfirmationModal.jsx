/**
 * ConfirmationModal - Professional Confirmation Dialog Component
 *
 * Replaces browser confirm() dialogs with a styled modal using the Workside green theme.
 * Supports multiple variants: primary (green), danger (red), warning (amber), info (blue).
 *
 * @module components/ConfirmationModal
 */

import React, { useEffect, useCallback } from 'react';

/**
 * ConfirmationModal component for consistent styled confirmation dialogs
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal should close
 * @param {Function} props.onConfirm - Function to call when action is confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message/description
 * @param {string} props.confirmText - Text for confirm button (default: 'Confirm')
 * @param {string} props.cancelText - Text for cancel button (default: 'Cancel')
 * @param {string} props.variant - Modal variant: 'primary' | 'danger' | 'warning' | 'info' (default: 'primary')
 * @param {boolean} props.isLoading - Whether the action is in progress
 * @param {string} props.icon - Optional custom icon type: 'success' | 'warning' | 'error' | 'info' | 'question'
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'info'
  isLoading = false,
  icon = null,
}) => {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e) => {
    if (!isLoading && e.target === e.currentTarget) {
      onClose();
    }
  }, [isLoading, onClose]);

  if (!isOpen) return null;

  // Variant configurations - Workside uses green as primary
  const variantStyles = {
    primary: {
      headerGradient: 'bg-gradient-to-r from-green-600 to-green-700',
      confirmBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    danger: {
      headerGradient: 'bg-gradient-to-r from-red-600 to-red-700',
      confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    warning: {
      headerGradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
      confirmBg: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    info: {
      headerGradient: 'bg-gradient-to-r from-blue-600 to-blue-700',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
  };

  const styles = variantStyles[variant] || variantStyles.primary;

  // Icon configurations
  const getIcon = () => {
    let iconType = icon;
    if (!iconType) {
      if (variant === 'danger' || variant === 'warning') {
        iconType = 'warning';
      } else if (variant === 'info') {
        iconType = 'info';
      } else {
        iconType = 'question';
      }
    }

    const icons = {
      success: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      warning: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      error: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      info: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      question: (
        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };

    return icons[iconType] || icons.question;
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header with Workside branding */}
          <div className={`px-6 py-4 ${styles.headerGradient} rounded-t-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getIcon()}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-white font-bold text-lg">WORKSIDE</span>
                  </div>
                  <h3 id="modal-title" className="text-sm font-medium text-white/90 mt-0.5">
                    {title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="text-white/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end rounded-b-xl border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmBg} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
