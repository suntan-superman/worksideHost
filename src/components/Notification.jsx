/* eslint-disable */

import React from "react";
import { MdOutlineCancel } from 'react-icons/md';
import Button from "./Button.jsx";
import { chatData } from '../data/dummy';
import { UseStateContext } from "../contexts/ContextProvider";

/**
 * Notification component displays a list of notifications in a styled dropdown.
 *
 * @component
 * @returns {JSX.Element} A notification dropdown with a list of messages and a button to view all notifications.
 *
 * @example
 * <Notification />
 *
 * @description
 * - The component uses the `UseStateContext` hook to retrieve the current theme color.
 * - It displays a header with a title and a badge indicating the number of new notifications.
 * - Notifications are rendered dynamically from the `chatData` array, showing an image, message, and description for each item.
 * - Includes a "See all notifications" button styled with the current theme color.
 *
 * @dependencies
 * - `UseStateContext`: Custom hook to access the current theme color.
 * - `Button`: A reusable button component.
 * - `MdOutlineCancel`: Icon used for the cancel button.
 *
 * @props
 * This component does not accept any props.
 */
const Notification = () => {
	const { currentColor } = UseStateContext();

	return (
		<div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
			<div className="flex justify-between items-center">
				<div className="flex gap-3">
					<p className="font-semibold text-lg dark:text-gray-200">
						Notifications
					</p>
					<button
						type="button"
						className="text-white text-xs rounded p-1 px-2 bg-orange-theme "
					>
						{" "}
						5 New
					</button>
				</div>
				<Button
					icon={<MdOutlineCancel />}
					color="rgb(153, 171, 180)"
					bgHoverColor="light-gray"
					size="2xl"
					borderRadius="50%"
				/>
			</div>
			<div className="mt-5 ">
				{chatData?.map((item, index) => (
					<div
						key={index}
						className="flex items-center leading-8 gap-5 border-b-1 border-color p-3"
					>
						<img
							className="rounded-full h-10 w-10"
							src={item.image}
							alt={item.message}
						/>
						<div>
							<p className="font-semibold dark:text-gray-200">{item.message}</p>
							<p className="text-gray-500 text-sm dark:text-gray-400">
								{" "}
								{item.desc}{" "}
							</p>
						</div>
					</div>
				))}
				<div className="mt-5">
					<Button
						color="white"
						bgColor={currentColor}
						text="See all notifications"
						borderRadius="10px"
						width="full"
					/>
				</div>
			</div>
		</div>
	);
};

export default Notification;
