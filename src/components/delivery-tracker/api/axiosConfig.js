/* eslint-disable */
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL
		|| "http://localhost:5000",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// Add request interceptor for auth and debugging
axiosInstance.interceptors.request.use((request) => {
	// Add authentication token from localStorage
	const token = localStorage.getItem('auth_token');
	if (token) {
		request.headers['Authorization'] = `Bearer ${token}`;
	}
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