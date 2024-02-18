import { useContext } from 'react';
import { RigContext } from '../contexts/ContextProvider';

export const useRigContext = () => {
  const context = useContext(RigContext);

  if (!context) {
    throw Error('useRigContext must be used inside a RigContextProvider');
  }

  return context;
};
