/* eslint-disable indent */
/* eslint-disable react/react-in-jsx-scope */

import { Navigate, useLocation } from "react-router-dom";

/**
 * A component that restricts access to its children based on the user's login status.
 * If the user is not logged in, they are redirected to the login page.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is logged in.
 * @returns {React.ReactNode} The children if logged in, otherwise a <Navigate> component to redirect to the login page.
 */
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
