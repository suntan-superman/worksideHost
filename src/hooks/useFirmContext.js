import { useContext } from 'react';
import { FirmContext } from '../contexts/ContextProvider';

export const useFirmContext = () => {
  const context = useContext(FirmContext);

  if (!context) {
    throw Error('useFirmContext must be used inside a FirmContextProvider');
  }

  return context;
};
