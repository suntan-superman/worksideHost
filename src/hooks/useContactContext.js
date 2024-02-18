import { useContext } from 'react';
import { ContactContext } from '../contexts/ContextProvider';

export const useContactContext = () => {
  const context = useContext(ContactContext);

  if (!context) {
    throw Error('useContactContext must be used inside a ContactContextProvider');
  }

  return context;
};
