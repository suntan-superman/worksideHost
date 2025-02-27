/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */

import { Navigate, useLocation } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
	const location = useLocation();
	const isLoggedIn = localStorage.getItem("logInFlag");

	// console.log("PrivateRoutes check:", {
	// 	path: location.pathname,
	// 	isLoggedIn: !!isLoggedIn,
	// });

	if (!isLoggedIn) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
};

export default PrivateRoutes;
