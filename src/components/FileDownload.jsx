import React from "react";
import axios from "axios";

/**
 * FileDownload Component
 *
 * This component provides a button to download a file from a backend API.
 * The file is fetched as binary data (blob) and downloaded to the user's device.
 *
 * @component
 *
 * @example
 * <FileDownload />
 *
 * @returns {JSX.Element} A React component with a button to trigger file download.
 *
 * @function handleDownload
 * Handles the file download process by sending a GET request to the backend API.
 * The file is retrieved as a blob and downloaded using a dynamically created anchor element.
 *
 * @throws Will log an error to the console if the file download fails.
 */
const FileDownload = () => {
	const id = "67364d5e1c5887c50d0a262b";
	const apiURL = `${process.env.REACT_APP_API_URL}/api/download/${id}`;

	const handleDownload = async () => {
		try {
			// Send a GET request to the backend to download the file
			const response = await axios.get(apiURL, {
				responseType: "blob", // Important for handling binary data
			});

			// Create a blob from the response
			const fileBlob = new Blob([response.data]);

			// Create a URL for the blob and open it in a new window
			const url = window.URL.createObjectURL(fileBlob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "downloaded-file"); // Set the downloaded file name
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<div className="App">
			<h1>Download File from Google Cloud Storage</h1>
			<button
				type="button"
				onClick={handleDownload}
				className="download-button"
			>
				Download File
			</button>
		</div>
	);
};

export default FileDownload;
