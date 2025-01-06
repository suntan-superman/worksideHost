import { create } from "zustand";

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
