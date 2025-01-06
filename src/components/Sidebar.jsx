/* eslint-disable */
import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { links } from '../data/dummy';
import { UseStateContext } from "../contexts/ContextProvider";
import { signalIsUserLoggedIn } from "../stores/SignalStores";

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

	const activeMenuStyle = "ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-black";
	const inActiveMenuStyle = "ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 bg-white";

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
					<div className="mt-10 ">
						{links.map((item) => (
							<div key={item.title}>
								<p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
									{item.title}
								</p>
								{item.links.map((link) => (
									<NavLink
										to={`/main/${link.name}`}
										key={link.name}
										// isDisabled={!signalIsUserLoggedIn.value}
										onClick={handleCloseSideBar}
										className={() =>
											signalIsUserLoggedIn.value ? activeLink : normalLink
										}
									>
										{link.icon}
										<span className="capitalize text-bold text-xl text-white">
											{link.name}
										</span>
										{/* <span className="capitalize ">{link.name}</span> */}
									</NavLink>
								))}
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default Sidebar;
