/* eslint-disable */
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { registerLicense } from "@syncfusion/ej2-base";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import {
	useStateContext,
} from "./contexts/ContextProvider";
import {
	Dashboard,
	Projects,
	Notifications,
	Requests,
	Admin,
	Scheduler,
} from "./pages";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PrivateRoutes from "./utils/PrivateRoutes";
import {
	LoginDialog,
	Sidebar,
	Navbar,
	ThemeSettings,
	Footer,
} from "./components";
import { FiSettings } from "react-icons/fi";
import { BsFillLockFill } from "react-icons/bs";
import { toast } from "react-toastify";

  const onLogOut = () => {
			toast.success("Logging Out...");
			// setIsLoggedIn(false);
			// setGlobalUserName("");
			// signalIsUserLoggedIn.value = false;
			localStorage.removeItem("token");
			localStorage.removeItem("userName");
			localStorage.setItem("logInFlag", "false");
			window.location = "/login";
		};

const ThemeSettingButton = () => {
  const {
			currentColor,
			setThemeSettings,
		} = useStateContext();

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
    const {
					currentColor,
				} = useStateContext();

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
			<Navbar />
		</div>
  );
}

const MainApp = () => {
  const {
		currentMode,
		activeMenu,
		themeSettings,
	} = useStateContext();

  return (
			<div className={currentMode === "Dark" ? "dark" : ""}>
				<div className="flex relative dark:bg-main-dark-bg w-full">
					{/* Theme Setting Button */}
					<ThemeSettingButton />
					{/* Log Out Button */}
					<LogOutButton />
					{/* Sidebar */}
					<SideBarComponent />
					{/* Navbar */}
					<div
						className={
							activeMenu
								? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full"
								: "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2"
						}
					>
						<div>
							<NavBarComponent />
						</div>
						{/* Show Theme Settings */}
						{themeSettings && <ThemeSettings />}
						<div>
							<Routes>
								<Route element={<PrivateRoutes />}>
									<Route path="/dashboard" exact element={<Dashboard />} />
									<Route path="/projects" exact element={<Projects />} />
									<Route path="/requests" exact element={<Requests />} />
									<Route
										path="/notifications"
										exact
										element={<Notifications />}
									/>
									<Route
										path="/admin"
										// exact
										element={<Admin />}
									/>
									<Route path="/scheduler" exact element={<Scheduler />} />
									<Route
										path="/resetpassword"
										exact
										element={<ResetPasswordPage />}
									/>
								</Route>
							</Routes>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		);
};

const App = () => {
 registerLicense(
		"Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH9cdHZXRGhYWUV3VkE=",
	);

  return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Navigate replace to="/login" />} />
					<Route path="/login" element={<LoginDialog />} />
					<Route path="main/*" element={<MainApp />} />
				</Routes>
			</BrowserRouter>
		);
}

export default App;

