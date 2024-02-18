import { useContext } from 'react';
import { RequestContext } from '../contexts/ContextProvider';

export const useRequestContext = () => {
  const context = useContext(RequestContext);

  if (!context) {
    throw Error('useRequestContext must be used inside a RequestContextProvider');
  }

  return context;
};
