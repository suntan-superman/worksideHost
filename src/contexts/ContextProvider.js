/* eslint-disable */
import React, { createContext, useContext, useState, useReducer } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

/**
 * ContextProvider component that provides a global state context to its children.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access to the context.
 *
 * @returns {JSX.Element} A context provider wrapping the children components.
 *
 * @context
 * @property {string} currentColor - The current theme color.
 * @property {string} currentMode - The current theme mode (e.g., "Light" or "Dark").
 * @property {boolean} activeMenu - Indicates whether the menu is active.
 * @property {number|undefined} screenSize - The current screen size.
 * @property {Function} setScreenSize - Function to update the screen size.
 * @property {Function} handleClick - Function to handle click events and update the `isClicked` state.
 * @property {Object} isClicked - State object representing which elements are clicked.
 * @property {Object} initialState - The initial state for `isClicked`.
 * @property {Function} setIsClicked - Function to update the `isClicked` state.
 * @property {Function} setActiveMenu - Function to update the `activeMenu` state.
 * @property {Function} setCurrentColor - Function to update the `currentColor` state.
 * @property {Function} setCurrentMode - Function to update the `currentMode` state.
 * @property {Function} setMode - Function to set the theme mode and save it to localStorage.
 * @property {Function} setColor - Function to set the theme color and save it to localStorage.
 * @property {boolean} themeSettings - Indicates whether theme settings are open.
 * @property {Function} setThemeSettings - Function to update the `themeSettings` state.
 * @property {boolean} deleteFlag - Indicates whether a delete action is flagged.
 * @property {Function} setDeleteFlag - Function to update the `deleteFlag` state.
 * @property {boolean} isLoggedIn - Indicates whether the user is logged in.
 * @property {Function} setIsLoggedIn - Function to update the `isLoggedIn` state.
 * @property {string} globalUserName - The global username of the logged-in user.
 * @property {Function} setGlobalUserName - Function to update the `globalUserName` state.
 * @property {string} userEmail - The email of the logged-in user.
 * @property {Function} setUserEmail - Function to update the `userEmail` state.
 * @property {number} accessLevel - The access level of the logged-in user.
 * @property {Function} setAccessLevel - Function to update the `accessLevel` state.
 * @property {string} companyName - The name of the company associated with the user.
 * @property {Function} setCompanyName - Function to update the `companyName` state.
 * @property {string} companyID - The ID of the company associated with the user.
 * @property {Function} setCompanyID - Function to update the `companyID` state.
 */
export const ContextProvider = ({ children }) => {
	const [screenSize, setScreenSize] = useState(undefined);
	const [currentColor, setCurrentColor] = useState("#7E7574");
	const [currentMode, setCurrentMode] = useState("Light");
	const [themeSettings, setThemeSettings] = useState(false);
	const [activeMenu, setActiveMenu] = useState(true);
	const [isClicked, setIsClicked] = useState(initialState);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [globalUserName, setGlobalUserName] = useState("");
	const [deleteFlag, setDeleteFlag] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [companyID, setCompanyID] = useState("");
	const [accessLevel, setAccessLevel] = useState(0);

	const setMode = (e) => {
		setCurrentMode(e.target.value);
		localStorage.setItem("themeMode", e.target.value);
	};

	const setColor = (color) => {
		setCurrentColor(color);
		localStorage.setItem("colorMode", color);
	};

	const handleClick = (clicked) =>
		setIsClicked({ ...initialState, [clicked]: true });

	return (
		// eslint-disable-next-line react/jsx-no-constructed-context-values
		<StateContext.Provider
			value={{
				currentColor,
				currentMode,
				activeMenu,
				screenSize,
				setScreenSize,
				handleClick,
				isClicked,
				initialState,
				setIsClicked,
				setActiveMenu,
				setCurrentColor,
				setCurrentMode,
				setMode,
				setColor,
				themeSettings,
				setThemeSettings,
				deleteFlag,
				setDeleteFlag,
				isLoggedIn,
				setIsLoggedIn,
				globalUserName,
				setGlobalUserName,
				userEmail,
				setUserEmail,
				accessLevel,
				setAccessLevel,
				companyName,
				setCompanyName,
				companyID,
				setCompanyID,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const UseStateContext = () => useContext(StateContext);

// User Context

export const UserContext = createContext();

export const userReducer = (state, action) => {
  switch (action.type) {
    case "GET_USER":
      return {
        usersData: action.payload,
      };
    case "CREATE_USER":
      return {
        usersData: [action.payload, ...state.usersData],
      };
    case "DELETE_USER":
      return {
        usersData: state.usersData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    usersData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

