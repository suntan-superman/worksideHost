import { useContext } from 'react';
import { UserContext } from '../contexts/ContextProvider';

/**
 * Custom hook to access the UserContext.
 * Ensures that the hook is used within a UserContextProvider.
 *
 * @throws {Error} Throws an error if the hook is used outside of a UserContextProvider.
 * @returns {Object} The value provided by the UserContext.
 */
export const useUserContext = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw Error("useUserContext must be used inside a UserContextProvider");
	}

	return context;
};
