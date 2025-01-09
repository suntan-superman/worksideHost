import { useState, useEffect } from "react";

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




