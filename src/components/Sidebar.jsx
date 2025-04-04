/* eslint-disable */
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { links } from "../data/worksideLayout";
import { UseStateContext } from "../contexts/ContextProvider";
import { signalIsUserLoggedIn } from "../stores/SignalStores";
import { Divider } from "@mui/material";
import { SchedulerIcon, RequestIcon } from "../icons/Icons";

/**
 * Sidebar component that renders a collapsible sidebar with navigation links.
 *
 * @component
 * @returns {JSX.Element} The rendered Sidebar component.
 *
 * @description
 * The Sidebar component is responsible for displaying a navigation menu that can
 * be toggled open or closed. It adapts its style based on the `activeMenu` state
 * and the screen size. The component uses context to manage state and styling.
 *
 * @example
 * <Sidebar />
 *
 * @dependencies
 * - `UseStateContext`: Custom context hook for managing state.
 * - `Link`: React Router's Link component for navigation.
 * - `TooltipComponent`: Component for displaying tooltips.
 * - `MdOutlineCancel`: Icon for the close button.
 * - `NavLink`: React Router's NavLink component for active link styling.
 *
 * @state
 * - `currentColor`: The current theme color.
 * - `activeMenu`: Boolean indicating whether the sidebar is open.
 * - `setActiveMenu`: Function to toggle the sidebar's open/closed state.
 * - `screenSize`: The current screen size.
 *
 * @styles
 * - `activeLink`: CSS classes for active navigation links.
 * - `normalLink`: CSS classes for inactive navigation links.
 * - `activeMenuStyle`: CSS classes for the sidebar when active.
 * - `inActiveMenuStyle`: CSS classes for the sidebar when inactive.
 *
 * @events
 * - `handleCloseSideBar`: Closes the sidebar when the screen size is small.
 * - `onClick`: Toggles the sidebar state or navigates to a link.
 */
const Sidebar = () => {
	const { currentColor, activeMenu, setActiveMenu, screenSize } =
		UseStateContext();

	const handleCloseSideBar = () => {
		if (activeMenu !== undefined && screenSize <= 900) {
			setActiveMenu(false);
		}
	};

	// useEffect(() => {
	// 	window.alert(`SideBar: ${signalIsUserLoggedIn.value}`);
	// }, [signalIsUserLoggedIn.value]);

	const activeLink =
		"flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white font-bold  text-md m-2";
	const normalLink =
		"flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 font-bold dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

	const activeMenuStyle =
		"ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-black";
	const inActiveMenuStyle =
		"ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-white";

	return (
		<div className={activeMenu ? activeMenuStyle : inActiveMenuStyle}>
			{activeMenu && (
				<>
					<div className="flex justify-between items-center">
						<Link
							to="/"
							onClick={handleCloseSideBar}
							className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
						>
							<span>
								<span className="text-green-500 text-3xl">WORK</span>
								<span className="text-white text-3xl">SIDE</span>
							</span>
						</Link>
						<TooltipComponent content="Menu" position="BottomCenter">
							<button
								type="button"
								onClick={() => setActiveMenu(!activeMenu)}
								style={{ color: currentColor }}
								className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
							>
								<MdOutlineCancel />
							</button>
						</TooltipComponent>
					</div>
					<div className="mt-10">
						{links.map((item, index) => {
							if (item.type === "divider") {
								return (
									<Divider
										key={`divider-${index}`}
										sx={{
											my: 2,
											borderColor: "rgba(255, 255, 255, 0.3)",
											width: "90%",
											mx: "auto",
											borderBottomWidth: 2,
										}}
									/>
								);
							}
							return (
								<NavLink
									key={item.name}
									to={`/main/${item.name}`}
									onClick={handleCloseSideBar}
									className={({ isActive }) =>
										signalIsUserLoggedIn.value
											? isActive
												? activeLink
												: normalLink
											: normalLink
									}
								>
									{item.icon}
									<span className="capitalize text-bold text-xl text-white">
										{item.name}
									</span>
								</NavLink>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default Sidebar;
