/* eslint-disable */
import React, { useState } from "react";

const SideNavBar = () => {
	const [selectedOption, setSelectedOption] = useState("Dashboard");

	return (
		<div>
			<nav className="w-64 bg-gray-800 text-white flex flex-col justify-between">
				<div>
					<h1 className="text-center text-xl font-bold p-6">
						Workside Software
					</h1>
					<ul className="space-y-4 text-center">
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Dashboard")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Dashboard
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Projects")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Projects
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Requests")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Requests
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Notifications")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Notifications
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Admin")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Admin
							</button>
						</li>
						<li>
							<button
								type="button"
								onClick={() => setSelectedOption("Scheduler")}
								className="w-full py-2 hover:bg-gray-700"
							>
								Scheduler
							</button>
						</li>
					</ul>
				</div>
				<div className="p-6">
					<button
						type="button"
						onClick={() => setShowLogoutDialog(true)}
						className="w-full bg-red-600 py-2 hover:bg-red-700 text-white rounded"
					>
						Logout
					</button>
				</div>
			</nav>
		</div>
	);
};

export default SideNavBar;
