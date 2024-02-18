import { useContext } from 'react';
import { CustomerContext } from '../contexts/ContextProvider';

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw Error('useCustomerContext must be used inside a CustomerContextProvider');
  }

  return context;
};
