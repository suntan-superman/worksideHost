/* eslint-disable */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { registerLicense } from "@syncfusion/ej2-base";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { UseStateContext } from "./contexts/ContextProvider";
import {
	Dashboard,
	Projects,
	Notifications,
	Requests,
	Admin,
	Supplier,
	Scheduler,
} from "./pages";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoutes from "./utils/PrivateRoutes";
import {
	LoginDialog,
	SignupDialog,
	Sidebar,
	ThemeSettings,
	Footer,
} from "./components";
import NavBar from "./components/NavBar";
import { FiSettings } from "react-icons/fi";
import { BsFillLockFill } from "react-icons/bs";

import { showConfirmationDialog } from "./utils/useSweetAlert";
import VerifyEmail from "./pages/VerifyEmail";
import { DeliveryTracker } from "./components/delivery-tracker";
import ErrorBoundary from "./components/delivery-tracker/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import "./styles/material.css";
// TODO: Implement privileges based on access level

	const onLogOut = async () => {
		const logoutFlag = await showConfirmationDialog(
			"Are you sure you want to log out?",
		);

		if (logoutFlag === true) {
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.setItem("logInFlag", "false");
			window.location = "/login";
		}
	};

const ThemeSettingButton = () => {
  const { currentColor, setThemeSettings } = UseStateContext();

    return (
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
  );
}

const LogOutButton = () => {
  const { currentColor } = UseStateContext();

  return (
    <div className="fixed left-4 bottom-4 pl-3" style={{ zIndex: "1000" }}>
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
  );
}

const SideBarComponent = () => {
  return (
		<div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
			<Sidebar />
		</div>
	);
}

const NavBarComponent = () => {
  return (
			<div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
				<NavBar />
			</div>
		);
}

const MainApp = () => {
  const { currentMode, activeMenu, themeSettings } = UseStateContext();
  
  return (
			<div className={currentMode === "Dark" ? "dark" : ""}>
				<div className="flex relative dark:bg-main-dark-bg w-full">
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
    "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9cdHZXRGhYWUV3VkE="
  );

  return (
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
    </Routes>
  );
};

export default App;

