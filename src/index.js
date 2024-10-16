/* eslint-disable */

import React from "react";
import ReactDOM from 'react-dom';

import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import {
  ContextProvider,
  UserContextProvider,
} from './contexts/ContextProvider';

ReactDOM.render(
	<React.StrictMode>
		<ContextProvider>
			<UserContextProvider>
				{/* <CustomerContextProvider> */}
				<App />
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					draggable
					pauseOnHover
					theme="light"
				/>
				{/* </CustomerContextProvider> */}
			</UserContextProvider>
		</ContextProvider>
	</React.StrictMode>,
	document.getElementById("root"),
);
