import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { BsFillLockFill } from "react-icons/bs";
import { registerLicense } from "@syncfusion/ej2-base";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { toast } from "react-toastify";

import {
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings,
  LoginDialog,
  SignupDialog,
} from "./components";
import {
  Dashboard,
  Projects,
  Notifications,
  Requests,
  Admin,
  Settings,
  Scheduler,
} from "./pages";
import "./App.css";
import PrivateRoutes from "./utils/PrivateRoutes";

import {
  useStateContext,
  ContactContextProvider,
  FirmContextProvider,
  RigContextProvider,
  ProductContextProvider,
  RequestContextProvider,
  ProjectContextProvider,
  SupplierProductContextProvider,
} from "./contexts/ContextProvider";

const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
    isLoggedIn,
    setIsLoggedIn,
    setGlobalUserName,
  } = useStateContext();
  registerLicense(
    "ORg4AjUWIQA/Gnt2VlhhQlJCfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn9Td0diUH1bcX1VQmBZ"
  );
  // Make sure token exists
  const [user, setUser] = useState(null);

  const onLogOut = () => {
    toast.success("Logging Out...");
    setIsLoggedIn(false);
    setGlobalUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.setItem("logInFlag", "false");
    window.location = "/login";
  };

  useEffect(() => {
    // eslint-disable-next-line no-const-assign
    // setUser(JSON.parse(localStorage.getItem('token')));
    setUser(localStorage.getItem("userName"));
    // const loggedInFLag = localStorage.getItem('logInFlag');
    // setIsLoggedIn(!!loggedInFLag);

    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {/* Settings Button */}
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {/* Log Out Button */}
          <div className="fixed left-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Log Out" position="Top">
              <button
                type="button"
                onClick={onLogOut}
                style={{ background: currentColor, borderRadius: "50%" }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <BsFillLockFill />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            {/* Open Login Dialog Initially */}
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              {themeSettings && <ThemeSettings />}
              {/* <CustomerContextProvider>
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path='/customers' exact element={<Customers />} />
                  </Route>
                </Routes>
              </CustomerContextProvider> */}

              <FirmContextProvider>
                <ContactContextProvider>
                  <RigContextProvider>
                    <ProductContextProvider>
                      <SupplierProductContextProvider>
                        <Routes>
                          <Route element={<PrivateRoutes />}>
                            <Route path="/admin" exact element={<Admin />} />
                          </Route>
                        </Routes>
                      </SupplierProductContextProvider>
                    </ProductContextProvider>
                  </RigContextProvider>
                </ContactContextProvider>
              </FirmContextProvider>

              <RequestContextProvider>
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path="/requests" exact element={<Requests />} />
                  </Route>
                </Routes>
              </RequestContextProvider>

              <ProjectContextProvider>
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path="/projects" exact element={<Projects />} />
                  </Route>
                </Routes>
              </ProjectContextProvider>

              <Routes>
                {!isLoggedIn && (
                  <Route path="/signup" element={<SignupDialog />} />
                )}
                {!isLoggedIn && (
                  <Route path="/login" element={<LoginDialog />} />
                )}
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route element={<PrivateRoutes />}>
                  <Route path="/dashboard" exact element={<Dashboard />} />
                  <Route
                    path="/notifications"
                    exact
                    element={<Notifications />}
                  />
                  {/* <Route path='/rigs' exact element={<RigCompanies />} />
                  <Route path='/suppliers' exact element={<Suppliers />} /> */}
                  <Route path="/settings" exact element={<Settings />} />
                  <Route path="/scheduler" exact element={<Scheduler />} />
                  <Route path="/" element={<Navigate replace to="/login" />} />
                </Route>
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
