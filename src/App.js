/* eslint-disable */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { registerLicense } from "@syncfusion/ej2-base";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { UseStateContext } from "./contexts/ContextProvider";
import { ToastProvider } from "./contexts/ToastContext";
import {
	Dashboard,
	Projects,
	Requests,
	Admin,
	Supplier,
	Scheduler,
	ManageTemplates,
} from "./pages";
import PrivateRoutes from "./utils/PrivateRoutes";
import {
	LoginDialog,
	SignupDialog,
	Sidebar,
	ThemeSettings,
	Footer,
} from "./components";
import NavBar from "./components/Navbar";
import { FiSettings } from "react-icons/fi";
import { BsFillLockFill } from "react-icons/bs";

import useConfirmation from "./hooks/useConfirmation";
import VerifyEmail from "./pages/VerifyEmail";
import { DeliveryTracker } from "./components/delivery-tracker";
import ErrorBoundary from "./components/delivery-tracker/components/ErrorBoundary";
import { QueryClient } from "@tanstack/react-query";
import LogisticsExpertDashboard from "./components/LogisticsExpertDashboard";

import "./styles/material.css";
// TODO: Implement privileges based on access level

const ThemeSettingButton = () => {
  const { currentColor, setThemeSettings } = UseStateContext();

    return (
		<div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
			<TooltipComponent content="Settings" position="Top">
				<button
					type="button"
					onClick={() => setThemeSettings(true)}
					style={{ background: currentColor, borderRadius: "50%" }}
					className="p-3 text-3xl text-white hover:drop-shadow-xl hover:bg-light-gray"
				>
					<FiSettings />
				</button>
			</TooltipComponent>
		</div>
  );
}

const LogOutButton = () => {
  const { currentColor } = UseStateContext();
  const { confirm, ConfirmationDialog } = useConfirmation();

  const handleLogOut = async () => {
    const logoutFlag = await confirm({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      confirmText: 'Yes, Log Out',
      cancelText: 'Cancel',
      variant: 'primary',
      icon: 'question',
    });

    if (logoutFlag === true) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.setItem("logInFlag", "false");
      window.location = "/login";
    }
  };

  return (
    <>
      <div className="fixed pl-3 left-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Log Out" position="Top">
          <button
            type="button"
            onClick={handleLogOut}
            style={{ background: currentColor, borderRadius: "50%" }}
            className="p-3 text-3xl text-white hover:drop-shadow-xl hover:bg-light-gray"
          >
            <BsFillLockFill />
          </button>
        </TooltipComponent>
      </div>
      <ConfirmationDialog />
    </>
  );
}

const SideBarComponent = () => {
  return (
		<div className="fixed bg-white w-72 sidebar dark:bg-secondary-dark-bg ">
			<Sidebar />
		</div>
	);
}

const NavBarComponent = () => {
  return (
			<div className="fixed w-full md:static bg-main-bg dark:bg-main-dark-bg navbar ">
				<NavBar />
			</div>
		);
}

/**
 * MainApp component serves as the root component of the application.
 * It manages the layout and routing of the application, including theme settings,
 * sidebar visibility, and navigation between different pages.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered MainApp component.
 *
 * @example
 * <MainApp />
 *
 * @description
 * - Applies a dark mode class based on the `currentMode` context value.
 * - Renders a sidebar, navbar, and footer along with the main content area.
 * - Handles routing for various application pages such as Dashboard, Projects, Requests, Tracker, Admin, Supplier, Scheduler, and a fallback for unknown routes.
 * - Includes a `ThemeSettings` component when `themeSettings` is enabled.
 * - Integrates a `DeliveryTracker` component with Google Maps API for the "tracker" route.
 */
const MainApp = () => {
	const { currentMode, activeMenu, themeSettings } = UseStateContext();

	return (
		<div className={currentMode === "Dark" ? "dark" : ""}>
			<div className="relative flex w-full dark:bg-main-dark-bg">
				<ThemeSettingButton />
				<LogOutButton />
				<SideBarComponent />
				<div
					className={
						activeMenu
							? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
							: "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2"
					}
				>
					<div>
						<NavBarComponent />
					</div>
					{themeSettings && <ThemeSettings />}
					<div style={{ height: "calc(100vh - 64px)" }}>
						<Routes>
							<Route index element={<Navigate to="dashboard" replace />} />
							<Route path="dashboard" element={<Dashboard />} />
							<Route path="projects" element={<Projects />} />
							<Route path="requests" element={<Requests />} />
							<Route path="templates" element={<ManageTemplates />} />
							<Route
								path="tracker"
								element={
									<div style={{ height: "100%", position: "relative" }}>
										<ErrorBoundary>
											<DeliveryTracker
												apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
												config={{
													mapOptions: {
														center: { lat: 35.3733, lng: -119.0187 },
														zoom: 12,
													},
													updateInterval: 3000,
												}}
												onVehicleSelect={(vehicle) => {
													console.log("Selected vehicle:", vehicle);
												}}
											/>
										</ErrorBoundary>
									</div>
								}
							/>
							<Route path="admin" element={<Admin />} />
							<Route path="supplier" element={<Supplier />} />
							<Route path="scheduler" element={<Scheduler />} />
							<Route path="logistics" element={<LogisticsExpertDashboard />} />
							<Route
								path="*"
								element={
									<div style={{ padding: "20px" }}>
										<h1 style={{ color: "red" }}>Page Not Found</h1>
										<p>The page you're looking for doesn't exist.</p>
										<p>Current Path: {window.location.pathname}</p>
									</div>
								}
							/>
						</Routes>
					</div>
					<Footer />
				</div>
			</div>
		</div>
	);
};

const queryClient = new QueryClient();

const App = () => {
  registerLicense(
    "Ngo9BigBOggjHTQxAR8/V1JFaF5cXGRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWH1ccnVSRGRdWUJwXUtWYEg="
  );
  // registerLicense(
  //   "ORg4AjUWIQA/Gnt3VVhhQlJDfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5bd0diUX1WcnNQT2lVWkd2"
  // );

  return (
		<ToastProvider>
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<LoginDialog />} />
				<Route path="/signup" element={<SignupDialog />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				<Route
					path="/main/*"
					element={
						<PrivateRoutes>
							<MainApp />
						</PrivateRoutes>
					}
				/>
				<Route path="/manage-templates" element={<ManageTemplates />} />
				<Route path="*" element={<Navigate replace to="/login" />} />
			</Routes>
		</ToastProvider>
		);
};

export default App;

