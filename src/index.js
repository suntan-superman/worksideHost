/* eslint-disable */
import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './App';

import {
	ContextProvider,
	UserContextProvider,
} from "./contexts/ContextProvider";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 10, // 10 minutes
		},
	},
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ContextProvider>
			<UserContextProvider>
				{/* <UseStateContext> */}
				<QueryClientProvider client={queryClient}>
					<App />
					<ToastContainer
						position="top-right"
						autoClose={3000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						draggable
						pauseOnHover
						theme="light"
					/>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
				{/* </UseStateContext> */}
			</UserContextProvider>
		</ContextProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
