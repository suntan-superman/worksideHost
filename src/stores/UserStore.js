import { create } from "zustand";

const userStore = (set) => ({
	accessLevel: 0,
	setAccessLevel: (value) => set({ accessLevel: value }),
	userLoggedIn: false,
	setUserLoggedIn: (value) => set({ userLoggedIn: value }),
});

const useUserStore = create(userStore);

export default useUserStore;
