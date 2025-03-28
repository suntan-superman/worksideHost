import { useState, useEffect } from "react";

/**
 * Custom React hook for fetching data from a given URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Object} An object containing the following properties:
 *   - {any} data: The fetched data, or `null` if not yet fetched or if an error occurred.
 *   - {boolean} loading: A boolean indicating whether the fetch operation is in progress.
 *   - {Error|null} error: An error object if an error occurred during the fetch, or `null` otherwise.
 *
 * @example
 * const { data, loading, error } = useFetch('https://api.example.com/data');
 * if (loading) return <p>Loading...</p>;
 * if (error) return <p>Error: {error.message}</p>;
 * return <div>{JSON.stringify(data)}</div>;
 */
function useFetch(url) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const response = await fetch(url);
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
	}, [url]);

	return { data, loading, error };
}

export default useFetch;
