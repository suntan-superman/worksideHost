import { useContext } from 'react';
import { ProductContext } from '../contexts/ContextProvider';

export const useProductContext = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw Error('useProductContext must be used inside a ProductContextProvider');
  }

  return context;
};
