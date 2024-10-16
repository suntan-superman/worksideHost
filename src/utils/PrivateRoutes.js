/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */

import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
	const isLoggedIn = localStorage.getItem("logInFlag");
	return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
