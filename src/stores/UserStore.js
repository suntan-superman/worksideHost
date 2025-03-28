import { create } from "zustand";

/**
 * A store for managing user-related state.
 *
 * @param {Function} set - A function to update the state.
 * @returns {Object} The user store with state variables and their corresponding setters.
 * @property {number} userAccessLevel - The access level of the user.
 * @property {Function} setUserAccessLevel - Updates the user's access level.
 * @property {boolean} userLoggedIn - Indicates whether the user is logged in.
 * @property {Function} setUserLoggedIn - Updates the user's logged-in status.
 * @property {string} currentUserMode - The current mode of the user (e.g., "CUSTOMER").
 * @property {Function} setCurrentUserMode - Updates the user's current mode.
 * @property {string} currentCompanyName - The name of the current company.
 * @property {Function} setCurrentCompanyName - Updates the current company name.
 * @property {string} currentCompanyID - The ID of the current company.
 * @property {Function} setCurrentCompanyID - Updates the current company ID.
 * @property {string} currentCompanyType - The type of the current company.
 * @property {Function} setCurrentCompanyType - Updates the current company type.
 */
const userStore = (set) => ({
	userAccessLevel: 0,
	setUserAccessLevel: (value) => set({ userAccessLevel: value }),
	userLoggedIn: false,
	setUserLoggedIn: (value) => set({ userLoggedIn: value }),
	currentUserMode: "CUSTOMER",
	setCurrentUserMode: (value) => set({ currentUserMode: value }),
	currentCompanyName: "",
	setCurrentCompanyName: (value) => set({ currentCompanyName: value }),
	currentCompanyID: "",
	setCurrentCompanyID: (value) => set({ currentCompanyID: value }),
	currentCompanyType: "",
	setCurrentCompanyType: (value) => set({ currentCompanyType: value }),
});

const useUserStore = create(userStore);

export default useUserStore;
