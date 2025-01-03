/* eslint-disable */
import React, { createContext, useContext, useState, useReducer } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

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

export const useStateContext = () => useContext(StateContext);

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

