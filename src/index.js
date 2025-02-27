/* eslint-disable */
import React from "react";
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import { BrowserRouter } from "react-router-dom";

import {
	ContextProvider,
	UserContextProvider,
} from "./contexts/ContextProvider";
import { NotificationProvider } from "./contexts/NotificationContext";

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
		<BrowserRouter>
			<ContextProvider>
				<NotificationProvider>
					<UserContextProvider>
						{/* <UseStateContext> */}
						<QueryClientProvider client={queryClient}>
							<App />
							<ReactQueryDevtools initialIsOpen={false} />
						</QueryClientProvider>
						{/* </UseStateContext> */}
					</UserContextProvider>
				</NotificationProvider>
			</ContextProvider>
		</BrowserRouter>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
