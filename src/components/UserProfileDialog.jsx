import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { Button } from ".";
import { userProfileData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { toast } from "react-toastify";

const UserProfileDialog = () => {
  // if (!open) return null;

  const { currentColor, globalUserName, setGlobalUserName, setIsLoggedIn } =
    useStateContext();
  const navigate = useNavigate();

  const onLogOut = () => {
    // Validate User Next
    toast.success("Logging Out...");
    setIsLoggedIn(false);
    setGlobalUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("logInFlag");
    navigate("/login");
  };

  return (
			// <div onClick={onClose} className="overlay">
			<div
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.stopPropagation();
					}
				}}
				fixed
				inset-0
				bg-black
				bg-opacity-25
				backdrop-blur-sm
			>
				<div fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm>
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.stopPropagation();
							}
						}}
						role="button"
						tabIndex={0}
						className="modalContainer"
					>
						<div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
							<div className="flex justify-between items-center">
								<p className="font-semibold text-lg dark:text-gray-200">
									User Profile
								</p>
								<Button
									icon={<MdOutlineCancel />}
									color="rgb(153, 171, 180)"
									bgHoverColor="light-gray"
									size="2xl"
									borderRadius="50%"
								/>
							</div>
							<div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
								<img
									className="rounded-full h-24 w-24"
									src={avatar}
									alt="user-profile"
								/>
								<div>
									<p className="font-semibold text-xl dark:text-gray-200">
										{" "}
										{globalUserName}
									</p>
									<p className="text-gray-500 text-sm dark:text-gray-400">
										{" "}
										Administrator{" "}
									</p>
									<p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
										{" "}
										{globalUserName}{" "}
									</p>
								</div>
							</div>
							<div>
								{userProfileData.map((item, index) => (
									<div
										key={index}
										className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
									>
										<button
											type="button"
											style={{
												color: item.iconColor,
												backgroundColor: item.iconBg,
											}}
											className=" text-xl rounded-lg p-3 hover:bg-light-gray"
										>
											{item.icon}
										</button>

										<div>
											<p className="font-semibold dark:text-gray-200 ">
												{item.title}
											</p>
											<p className="text-gray-500 text-sm dark:text-gray-400">
												{" "}
												{item.desc}{" "}
											</p>
										</div>
									</div>
								))}
							</div>
							<div className="mt-5">
								<Button
									type="submit"
									color="white"
									bgColor={currentColor}
									text="Logout"
									borderRadius="10px"
									width="full"
									// onClick={onLogOut}
									onClick={onLogOut}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
};

export default UserProfileDialog;
