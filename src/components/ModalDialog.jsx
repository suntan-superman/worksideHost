/* eslint-disable */
import React from "react";
import Workside from '../assets/Workside.jpg';

/**
 * ModalDialog Component
 *
 * A reusable modal dialog component that displays a message and provides
 * options for user interaction.
 *
 * @param {Object} props - The component props.
 * @param {string} props.textMsg - The message to display inside the modal.
 * @param {boolean} props.open - A flag to control the visibility of the modal.
 * @param {Function} props.onOK - Callback function triggered when the "YES" button is clicked.
 * @param {Function} props.onClose - Callback function triggered when the modal is closed or the "NO" button is clicked.
 *
 * @returns {JSX.Element|null} The rendered modal dialog if `open` is true, otherwise null.
 */
const ModalDialog = ({ textMsg, open, onOK, onClose }) => {
	if (!open) return null;

	return (
		<div
			onClick={onClose}
			onKeyUp={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClose(e);
				}
			}}
			className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
		>
			<div
				onClick={(e) => {
					e.stopPropagation();
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.stopPropagation();
					}
				}}
				className="modalContainer"
			>
				<img src={Workside} alt="/" className="img" />
				<div className="modalRight">
					{/* <div className="content"> */}
					<div className="text-red font-bold text-xl text-center mb-20">
						{/* <p>Important:</p> */}
						<p>{textMsg}</p>
					</div>
					{/* <div className="btnContainer"> */}
					{/* <div className="container mx-auto px-4 flex flex-row h-32 w-32 "> */}
					<div className="container mx-auto px-4 flex flex-row h-32 w-32">
						<button
							className="inset-x-0 bottom-0 text-white bg-green-500 hover: bg-green-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5 h-14"
							type="button"
							onClick={onOK}
						>
							<span className="bold">YES</span>
						</button>
						<button
							className="inset-x-0 bottom-0 text-white bg-red-500 hover: bg-red-800 focus:outline-none font-medium text-sm rounded-lg px-5 py-2.5 text-center mr-5 h-14"
							type="button"
							onClick={onClose}
						>
							<span className="bold">NO</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalDialog;
