/**
 * useConfirmation - Confirmation Dialog Hook
 *
 * A React hook that provides an easy-to-use confirmation dialog system.
 * Replaces SweetAlert confirmation dialogs with the ConfirmationModal component.
 *
 * @module hooks/useConfirmation
 */

import React, { useState, useCallback, useMemo } from 'react';
import ConfirmationModal from '../components/common/ConfirmationModal';

/**
 * useConfirmation hook for displaying confirmation dialogs
 *
 * @returns {Object} - { confirm, ConfirmationDialog }
 *
 * @example
 * const { confirm, ConfirmationDialog } = useConfirmation();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Delete Item',
 *     message: 'Are you sure you want to delete this item?',
 *     variant: 'danger',
 *     confirmText: 'Delete',
 *   });
 *
 *   if (confirmed) {
 *     // Perform delete action
 *   }
 * };
 *
 * return (
 *   <>
 *     <button onClick={handleDelete}>Delete</button>
 *     <ConfirmationDialog />
 *   </>
 * );
 */
const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: 'Confirm',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    variant: 'primary',
    icon: null,
  });
  const [resolveRef, setResolveRef] = useState(null);

  const confirm = useCallback(({
    title = 'Confirm',
    message = '',
    confirmText = 'Yes',
    cancelText = 'No',
    variant = 'primary',
    icon = null,
  } = {}) => new Promise((resolve) => {
    setConfig({ title, message, confirmText, cancelText, variant, icon });
    setResolveRef(() => resolve);
    setIsOpen(true);
  }), []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(false);
      setResolveRef(null);
    }
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(true);
      setResolveRef(null);
    }
  }, [resolveRef]);

  // Memoize the dialog component to prevent unnecessary re-renders
  const ConfirmationDialog = useMemo(() => () => (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
      icon={config.icon}
    />
  ), [isOpen, handleClose, handleConfirm, config]);

  return { confirm, ConfirmationDialog };
};

export default useConfirmation;
