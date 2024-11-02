/* eslint-disable */
import React, { useEffect, useState, useRef, useMemo } from "react";
import Skeleton, { SkeletonText } from "react-loading-skeleton";
import Button from "./Button";

const UserValidationModal = ({ recordID, open, onOK, onClose }) => {
	if (!open || !recordID) return null;

	const [showRecord, setShowRecord] = useState(false);

	// Utilize useEffect to get Request Details
	// useEffect(() => {
	//   const fetchRequest = async () => {
	//     const apiUrl = process.env.REACT_APP_MONGO_URI;

	// 					// const fetchString = `${apiUrl}/api/request/${recordID}`;
	// 					const fetchString = `/api/request/${recordID}`;
	// 					// Set Wait Cursor
	// 					document.getElementById("root").style.cursor = "wait";
	// 					const response = await fetch(fetchString);
	// 					const json = await response.json();
	// 					// Set the Customer Name and remove double quotes at beginning and end
	// 					setCustomerName(
	// 						JSON.stringify(json.customername).replace(/^"(.*)"$/, "$1"),
	// 					);
	// 					setRigCompany(
	// 						JSON.stringify(json.rigcompany).replace(/^"(.*)"$/, "$1"),
	// 					);
	// 					setRequestName(
	// 						JSON.stringify(json.requestname).replace(/^"(.*)"$/, "$1"),
	// 					);
	// 					setRequestCategory(
	// 						JSON.stringify(json.requestcategory).replace(/^"(.*)"$/, "$1"),
	// 					);
	// 					const formattedDate = format(
	// 						new Date(json.datetimerequested),
	// 						"MMMM do yyyy, h:mm",
	// 					);
	// 					setDateTimeRequested(formattedDate);
	// 					// setDateTimeRequested(JSON.stringify(json.datetimerequested));
	// 					// Set Default Cursor
	// 					document.getElementById("root").style.cursor = "default";
	//   };
	//   fetchRequest();
	// }, []);

	const showID = () => {
		setShowRecord(!showRecord);
	};

	const inputFormat =
		"bg-gray-200 w-[100%] pt-1 pb-1 flex items-center mb-1 rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border border-[1px] border-solid border-black border-r-2 border-b-2 px-1";

	const buttonFormat =
		"bg-green-200 text-black p-0 rounded-lg w-24 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 text-base";

	return (
		<div
			// id="requestFrame"
			className="bg-white w-[100%] h-full overflow-hidden text-center text-lg text-black "
		>
			<div className="text-center text-xl font-bold pb-1">
				<span className="text-green-500">WORK</span>SIDE
			</div>
			{/* First Name */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">First Name</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="firstName"
						placeholder="First Name"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of First Name */}
			{/* Last Name */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Last Name</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="lastName"
						placeholder="Last Name"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Last Name */}
			{/* Nickname */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Nickname</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="nickName"
						placeholder="Nickname"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Last Name */}
			{/* Company */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Company</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="company"
						placeholder="Company"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Company */}
			{/* Access Level */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Access Level</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="accessLevel"
						placeholder="Access Level"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Access Level */}
			{/* Email */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Email</p>
				<div className={inputFormat}>
					<input
						type="email"
						name="email"
						placeholder="Email"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Email */}
			{/* Cell Number */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Cell Number</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="cellNumber"
						placeholder="Cell Number"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Cell Number */}
			{/* Status */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Status</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="status"
						placeholder="Status"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Status */}
			{/* Comment */}
			<div className="flex-col w-[95%] ml-2 mr-2">
				<p className="text-left text-xs font-semibold">Comment</p>
				<div className={inputFormat}>
					<input
						type="text"
						name="comment"
						placeholder="Comment"
						// value={userName}
						// onChange={(e) => setUserName(e.target.value)}
						className="bg-gray-200 outline-none text-sm flex-1"
					/>
				</div>
			</div>
			{/* End of Comment */}
			<div className="flex-row gap-4 space-x-3 pt-3">
				<button
					type="button"
					disabled={false}
					// onClick={handleSubmit}
					className={buttonFormat}
				>
					Save
				</button>
				<button
					type="button"
					disabled={false}
					onClick={showID}
					className={buttonFormat}
				>
					Cancel
				</button>
			</div>
			{showRecord && (
				<div>
					<p>Record Id: {recordID}</p>
				</div>
			)}
		</div>
	);
};

export default UserValidationModal;
