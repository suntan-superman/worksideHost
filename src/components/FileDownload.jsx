import React from "react";
import axios from "axios";

const FileDownload = () => {
	const id = "67364d5e1c5887c50d0a262b";
	// TODO: Update the URL to the backend endpoint
	const apiURL = `${process.env.REACT_APP_MONGO_URI}/api/download/${id}`;

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
