import { useContext } from 'react';
import { SupplierProductContext } from '../contexts/ContextProvider';

export const useSupplierProductContext = () => {
  const context = useContext(SupplierProductContext);

  if (!context) {
    throw Error('useSupplierProductContext must be used inside a SupplierProductContextProvider');
  }

  return context;
};
