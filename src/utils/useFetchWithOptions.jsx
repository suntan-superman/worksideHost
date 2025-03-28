import { useState, useEffect } from "react";

/**
 * Custom React hook for fetching data with configurable options.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {Object} [options={}] - Optional configuration for the fetch request.
 * @param {string} [options.method="GET"] - HTTP method to use for the request (e.g., "GET", "POST").
 * @param {Object} [options.headers={}] - Additional headers to include in the request.
 * @param {Object} [options.body=null] - The body of the request, which will be stringified if provided.
 * @returns {Object} - An object containing the following properties:
 *   - {any} data - The data returned from the fetch request, or `null` if not yet available.
 *   - {boolean} loading - A boolean indicating whether the fetch request is in progress.
 *   - {Error|null} error - An error object if the fetch request failed, or `null` if no error occurred.
 *
 * @example
 * const { data, loading, error } = useFetchWithOptions('/api/data', {
 *   method: 'POST',
 *   headers: { Authorization: 'Bearer token' },
 *   body: { key: 'value' },
 * });
 */
function useFetchWithOptions(url, options = {}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url, {
					method: options.method || "GET", // Default to GET
					headers: {
						"Content-Type": "application/json",
						...(options.headers || {}),
					},
					body: options.body ? JSON.stringify(options.body) : null,
				});
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const result = await response.json();
				setData(result);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [url, options]);

	return { data, loading, error };
}

export default useFetchWithOptions;

// Example POST
// const { data, loading, error } = useFetch("https://api.example.com/users", {
// 	method: "POST",
// 	body: { name: "John Doe", email: "john@example.com" },
// });

// Example PUT
// const { data, loading, error } = useFetch("https://api.example.com/users/1", {
// 	method: "PUT",
// 	body: { name: "John Updated", email: "john_updated@example.com" },
// });




