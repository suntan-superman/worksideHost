/* eslint-disable */
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_MONGO_URI
		|| "https://workside-software.wl.r.appspot.com",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use((request) => {
	// console.log("Starting Request:", request.url);
	return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
	(response) => {
		// console.log("Response:", response);
		return response;
	},
	(error) => {
		console.error("Request Error:", error);
		return Promise.reject(error);
	},
);

export default axiosInstance; 