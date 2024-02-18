import React, { createContext, useContext, useState, useReducer } from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#7E7574');
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [globalUserName, setGlobalUserName] = useState('');
  const [deleteFlag, setDeleteFlag] = useState(false);

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings, deleteFlag, setDeleteFlag, isLoggedIn, setIsLoggedIn, globalUserName, setGlobalUserName }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

// Customer Context

export const CustomerContext = createContext();

export const customerReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CUSTOMER':
      return {
        customersData: action.payload,
      };
    case 'CREATE_CUSTOMER':
      return {
        customersData: [action.payload, ...state.customersData],
      };
    case 'DELETE_CUSTOMER':
      return {
        customersData: state.customersData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const CustomerContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customerReducer, {
    customersData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <CustomerContext.Provider value={{ ...state, dispatch }}>
      { children }
    </CustomerContext.Provider>
  );
};

// Contact Context

export const ContactContext = createContext();

export const contactReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CONTACT':
      return {
        contactsData: action.payload,
      };
    case 'CREATE_CONTACT':
      return {
        contactsData: [action.payload, ...state.contactsData],
      };
    case 'DELETE_CONTACT':
      return {
        contactsData: state.contactsData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ContactContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, {
    contactsData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <ContactContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ContactContext.Provider>
  );
};

// Firm Context

export const FirmContext = createContext();

export const firmReducer = (state, action) => {
  switch (action.type) {
    case 'GET_FIRM':
      return {
        firmData: action.payload,
      };
    case 'CREATE_FIRM':
      return {
        firmData: [action.payload, ...state.firmData],
      };
    case 'DELETE_FIRM':
      return {
        firmData: state.firmData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const FirmContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firmReducer, {
    firmData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <FirmContext.Provider value={{ ...state, dispatch }}>
      { children }
    </FirmContext.Provider>
  );
};

// Rig Context

export const RigContext = createContext();

export const rigReducer = (state, action) => {
  switch (action.type) {
    case 'GET_RIG':
      return {
        rigData: action.payload,
      };
    case 'CREATE_RIG':
      return {
        rigData: [action.payload, ...state.rigData],
      };
    case 'DELETE_RIG':
      return {
        rigData: state.rigData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const RigContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rigReducer, {
    rigData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <RigContext.Provider value={{ ...state, dispatch }}>
      { children }
    </RigContext.Provider>
  );
};

// Product Context

export const ProductContext = createContext();

export const productReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PRODUCT':
      return {
        productsData: action.payload,
      };
    case 'CREATE_PRODUCT':
      return {
        productsData: [action.payload, ...state.productsData],
      };
    case 'DELETE_PRODUCT':
      return {
        productsData: state.productsData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    productsData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <ProductContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ProductContext.Provider>
  );
};

// Project Context

export const ProjectContext = createContext();

export const projectReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECT':
      return {
        projectsData: action.payload,
      };
    case 'CREATE_PROJECT':
      return {
        projectsData: [action.payload, ...state.projectsData],
      };
    case 'DELETE_PROJECT':
      return {
        projectsData: state.projectsData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const ProjectContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    projectsData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <ProjectContext.Provider value={{ ...state, dispatch }}>
      { children }
    </ProjectContext.Provider>
  );
};

// User Context

export const UserContext = createContext();

export const userReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USER':
      return {
        usersData: action.payload,
      };
    case 'CREATE_USER':
      return {
        usersData: [action.payload, ...state.usersData],
      };
    case 'DELETE_USER':
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
      { children }
    </UserContext.Provider>
  );
};

// Request Context

export const RequestContext = createContext();

export const requestReducer = (state, action) => {
  switch (action.type) {
    case 'GET_REQUEST':
      return {
        requestData: action.payload,
      };
    case 'CREATE_REQUEST':
      return {
        requestData: [action.payload, ...state.requestData],
      };
    case 'DELETE_REQUEST':
      return {
        requestData: state.requestData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const RequestContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(requestReducer, {
    requestData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <RequestContext.Provider value={{ ...state, dispatch }}>
      { children }
    </RequestContext.Provider>
  );
};

// SupplierProduct Context

export const SupplierProductContext = createContext();

export const supplierProductReducer = (state, action) => {
  switch (action.type) {
    case 'GET_SUPPLIERPRODUCT':
      return {
        supplierProductsData: action.payload,
      };
    case 'CREATE_SUPPLIERPRODUCT':
      return {
        supplierProductsData: [action.payload, ...state.supplierProductsData],
      };
    case 'DELETE_SUPPLIERPRODUCT':
      return {
        supplierProductsData: state.supplierProductsData.filter((c) => c._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const SupplierProductContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(supplierProductReducer, {
    supplierProductsData: null,
  });

  return (
    // eslint-disable-next-line react/react-in-jsx-scope, react/jsx-no-constructed-context-values
    <SupplierProductContext.Provider value={{ ...state, dispatch }}>
      { children }
    </SupplierProductContext.Provider>
  );
};

