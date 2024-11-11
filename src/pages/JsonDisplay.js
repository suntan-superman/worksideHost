/* eslint-disable */
import React from "react";

const JsonDisplay = ({ data }) => {
	return (
		<div className="w-4/5 h-1/2 bg-gray-100 p-4 border rounded overflow-auto mx-auto mt-10">
			<h2 className="text-xl font-bold mb-4 text-center">Query Data</h2>
			<pre className="text-left text-sm bg-white p-4 rounded shadow-inner overflow-x-auto">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
};

export default JsonDisplay;
