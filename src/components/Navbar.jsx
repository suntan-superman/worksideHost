/* eslint-disable */
import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { styled } from "@mui/material/styles";
import NotificationDialog from "../pages/NotificationDialog";
import HelpDialog from "./HelpDialog";
import AboutDialog from "./AboutDialog";
import UserProfileDialog from "./UserProfileDialog";
import avatar from "../data/avatar.jpg";
// eslint-disable-next-line import/no-cycle
import { Chat, Notification, UserProfile } from ".";
import { UseStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import { IconButton, Menu, MenuItem } from "@mui/material";

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

/**
 * NavBar Component
 *
 * This component renders a navigation bar with various interactive elements such as menu buttons,
 * notifications, help options, and user profile access. It dynamically adjusts its behavior and
 * appearance based on the screen size and user data.
 *
 * Hooks:
 * - `UseStateContext`: Provides context values for managing state such as active menu, screen size, and click events.
 * - `useState`: Manages local state for welcome phrase, access label, dialog visibility, menu width, user avatar, and help menu states.
 * - `useEffect`: Handles side effects such as window resize events, fetching user data, and setting initial states.
 *
 * State Variables:
 * - `welcomePhrase` (string): Displays a personalized welcome message for the user.
 * - `accessLabel` (string): Represents the user's access level (e.g., GUEST, ADMIN).
 * - `dialogOpen` (boolean): Controls the visibility of the notifications dialog.
 * - `menuWidth` (number): Tracks the width of the menu.
 * - `userAvatar` (string | null): Stores the URL of the user's avatar image.
 * - `helpMenuOpen` (boolean): Indicates whether the help menu is open.
 * - `helpAnchorEl` (HTMLElement | null): Stores the anchor element for the help menu.
 * - `helpDialogOpen` (boolean): Controls the visibility of the help dialog.
 * - `aboutDialogOpen` (boolean): Controls the visibility of the about dialog.
 * - `userProfileDialogOpen` (boolean): Controls the visibility of the user profile dialog.
 *
 * Effects:
 * - Adjusts the active menu state based on screen size.
 * - Fetches and sets the user's avatar from an API.
 * - Retrieves and sets the user's name and access level from local storage.
 *
 * Event Handlers:
 * - `handleActiveMenu`: Toggles the active menu state.
 * - `handleNotificationClick`: Opens the notifications dialog.
 * - `handleHelpClick`: Opens the help menu.
 * - `handleHelpClose`: Closes the help menu.
 * - `handleReportIssue`: Opens the help dialog for reporting issues.
 * - `handleAbout`: Opens the about dialog.
 * - `handleUserProfileClick`: Opens the user profile dialog.
 *
 * Returns:
 * - JSX structure for the navigation bar, including buttons, menus, dialogs, and user profile elements.
 */
const NavBar = () => {
	const {
		activeMenu,
		setActiveMenu,
		handleClick,
		isClicked,
		setScreenSize,
		screenSize,
	} = UseStateContext();
	const [welcomePhrase, setWelcomePhrase] = React.useState("");
	// const accessLevel = useUserStore((state) => state.accessLevel);
	const [accessLabel, setAccessLabel] = React.useState("UNKNOWN");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [menuWidth, setMenuWidth] = useState(0);
	const [userAvatar, setUserAvatar] = useState(null);
	const [helpMenuOpen, setHelpMenuOpen] = useState(false);
	const [helpAnchorEl, setHelpAnchorEl] = useState(null);
	const [helpDialogOpen, setHelpDialogOpen] = useState(false);
	const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
	const [userProfileDialogOpen, setUserProfileDialogOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => setScreenSize(window.innerWidth);

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, [setScreenSize]);

	useEffect(() => {
		const userName = localStorage.getItem("userName");
		setWelcomePhrase(`Welcome, ${userName}`);
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
			case 4:
				setAccessLabel("SUPERADMIN");
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

	useEffect(() => {
		const fetchUserAvatar = async () => {
			try {
				const contactId = localStorage.getItem("contactID")?.replace(/"/g, "");
				if (!contactId) return;

				const response = await axios.get(
					`${process.env.REACT_APP_MONGO_URI}/api/contact/${contactId}`,
				);
				if (response.data && response.data.avatar) {
					setUserAvatar(response.data.avatar);
				}
			} catch (error) {
				console.error("Error fetching user avatar: ", error);
			}
		};

		fetchUserAvatar();
	}, []);

	const handleActiveMenu = () => setActiveMenu(!activeMenu);

	const handleNotificationClick = () => {
		setDialogOpen(true);
	};

	const handleHelpClick = (event) => {
		setHelpAnchorEl(event.currentTarget);
	};

	const handleHelpClose = () => {
		setHelpAnchorEl(null);
	};

	const handleReportIssue = () => {
		handleHelpClose();
		setHelpDialogOpen(true);
	};

	const handleAbout = () => {
		handleHelpClose();
		setAboutDialogOpen(true);
	};

	const handleUserProfileClick = () => {
		setUserProfileDialogOpen(true);
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
						<div className="relative">
							<IconButton
								onClick={handleHelpClick}
								sx={{
									color: "white",
									"&:hover": {
										backgroundColor: "rgba(255, 255, 255, 0.1)",
									},
								}}
								aria-label="help"
							>
								<FaQuestionCircle size={24} />
							</IconButton>
							<Menu
								anchorEl={helpAnchorEl}
								open={Boolean(helpAnchorEl)}
								onClose={handleHelpClose}
							>
								<MenuItem onClick={handleReportIssue}>Report Issue</MenuItem>
								<MenuItem onClick={handleAbout}>About</MenuItem>
							</Menu>
						</div>
						<TooltipComponent content="Profile" position="BottomCenter">
							<div
								className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-800 rounded-lg"
								onClick={handleUserProfileClick}
								onKeyUp={handleUserProfileClick}
							>
								<img
									className="rounded-full w-8 h-8"
									src={userAvatar || avatar}
									alt="user-profile"
								/>
								<p>
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
			<HelpDialog
				open={helpDialogOpen}
				onClose={() => setHelpDialogOpen(false)}
			/>
			<AboutDialog
				open={aboutDialogOpen}
				onClose={() => setAboutDialogOpen(false)}
			/>
			<UserProfileDialog
				open={userProfileDialogOpen}
				onClose={() => setUserProfileDialogOpen(false)}
			/>
		</>
	);
};

export default NavBar;
