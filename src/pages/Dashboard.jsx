/* eslint-disable */
import React from "react";
import { Header } from "../components";
import { worksideData } from "../data/dummy";
// TODO Remove this for production
// import { useCookies } from "react-cookie";

const Dashboard = () => {
	const dashboardTitle = "Dashboard";
	// TODO Remove this for production
	/////////////////////////////////////////////////////////////////
	// const [cookies, setCookie] = useCookies(["cookieConsent"]);
	// setCookie("cookieConsent", false, { path: "/" });
	/////////////////////////////////////////////////////////////////
	// Beautiful Dashboard
	return (
		<div>
			<Header category="Workside" title={dashboardTitle} />
			<div className="flex flex-wrap lg:flex-nowrap justify-center ">
				<div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
					<div className="flex justify-between items-center">
						<div>
							<p className="font-bold text-gray-400">Open Requests</p>
							<p className="text-2xl">44</p>
							<p className="font-bold text-gray-400">Requests Filled Today</p>
							<p className="text-2xl">8</p>
							<p className="font-bold text-gray-400">
								Requests Filled This Week
							</p>
							<p className="text-2xl">37</p>
						</div>
					</div>
				</div>
				<div className="flex m-3 flex-wrap justify-center gap-1 items-center">
					{worksideData.map((item) => (
						<div
							key={item.title}
							className="bg-white h-44 dark:text-gray-500 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
						>
							<p className="text-center">
								<button
									type="button"
									style={{
										color: item.iconColor,
										backgroundColor: item.iconBg,
									}}
									className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
								>
									{item.icon}
								</button>
							</p>
							<p className="mt-3 text-center">
								<span className="text-lg font-semibold">{item.amount}</span>
								<span className={`text-sm text-${item.pcColor} ml-2`}>
									{item.percentage}
								</span>
							</p>
							<p className="text-lg text-gray-600  mt-1 text-center">
								{item.title}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
