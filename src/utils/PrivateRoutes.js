import { Outlet, Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const PrivateRoutes = () => {
//   const { isLoggedIn } = useStateContext();
  const isLoggedIn = localStorage.getItem('logInFlag');
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    isLoggedIn ? <Outlet /> : <Navigate to="/login" />
  );
};

export default PrivateRoutes;
