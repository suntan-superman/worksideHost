/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { styled } from "@mui/material/styles";
import NotificationDialog from "../pages/NotificationDialog";
import avatar from "../data/avatar.jpg";
// eslint-disable-next-line import/no-cycle
import { Chat, Notification, UserProfile } from ".";
import { UseStateContext } from "../contexts/ContextProvider";

// Create a styled div for consistent width
const NavBarContainer = styled("div")({
	width: "100%",
	maxWidth: "100vw",
	overflow: "hidden",
});

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
	<TooltipComponent content={title} position="BottomCenter">
		<button
			type="button"
			onClick={() => customFunc()}
			style={{ color }}
			className="relative text-xl rounded-full p-3 hover:bg-gray-800"
		>
			<span
				style={{ background: dotColor }}
				className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
			/>
			{icon}
		</button>
	</TooltipComponent>
);

const Navbar = () => {
	const navigate = useNavigate();
	const {
		currentColor,
		activeMenu,
		setActiveMenu,
		handleClick,
		isClicked,
		setScreenSize,
		screenSize,
		globalUserName,
		accessLevel,
	} = UseStateContext();
	const [welcomePhrase, setWelcomePhrase] = React.useState("");
	// const accessLevel = useUserStore((state) => state.accessLevel);
	const [accessLabel, setAccessLabel] = React.useState("UNKNOWN");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [menuWidth, setMenuWidth] = useState(0);

	useEffect(() => {
		const handleResize = () => setScreenSize(window.innerWidth);

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, [setScreenSize]);

	useEffect(() => {
		const userName = localStorage.getItem("userName");
		setWelcomePhrase(`Welcome, ${userName}`);
		console.log(" Welcome Phrase: ", welcomePhrase);
		const accessLevel = Number(localStorage.getItem("accessLevel"));
		switch (accessLevel) {
			case 0:
				setAccessLabel("GUEST");
				break;
			case 1:
				setAccessLabel("STANDARD");
				break;
			case 2:
				setAccessLabel("POWER");
				break;
			case 3:
				setAccessLabel("ADMIN");
				break;
			default:
				setAccessLabel("GUEST");
		}
	}, []);

	useEffect(() => {
		if (screenSize <= 900) {
			setActiveMenu(false);
		} else {
			setActiveMenu(true);
		}
	}, [screenSize, setActiveMenu]);

	const handleActiveMenu = () => setActiveMenu(!activeMenu);

	const handleNotificationClick = () => {
		setDialogOpen(true);
	};

	return (
		<>
			<NavBarContainer>
				<div className="flex justify-between p-2 relative bg-black">
					<NavButton
						title="Menu"
						customFunc={() =>
							setActiveMenu((prevActiveMenu) => !prevActiveMenu)
						}
						color="white"
						icon={<AiOutlineMenu />}
					/>

					{/* <div className={"flex w-full pl-[800px]"}> */}
					<div className={"flex w-full justify-end"}>
						<NavButton
							title="Chat"
							dotColor="#03C9D7"
							customFunc={() => handleClick("chat")}
							color="white"
							icon={<BsChatLeft />}
						/>
						<NavButton
							title="Notifications"
							dotColor="#03C9D7"
							customFunc={() => handleNotificationClick()}
							color="white"
							icon={<RiNotification3Line />}
						/>
						<TooltipComponent content="Profile" position="BottomCenter">
							<div
								className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-800 rounded-lg"
								onClick={() => handleClick("userProfile")}
								onKeyUp={() => handleClick("userProfile")}
							>
								<img
									className="rounded-full w-8 h-8"
									src={avatar}
									alt="user-profile"
								/>
								<p>
									{/* <span className="text-white text-14">Hi,</span>{" "} */}
									<span className="text-white font-bold ml-1 text-14">
										{welcomePhrase}
									</span>
								</p>
								<MdKeyboardArrowDown className="text-white text-14" />
							</div>
						</TooltipComponent>

						{isClicked.chat && <Chat />}
						{isClicked.notification && <Notification />}
						{isClicked.userProfile && <UserProfile />}
					</div>
				</div>
			</NavBarContainer>
			<NotificationDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
			/>
		</>
	);
};

export default Navbar;
