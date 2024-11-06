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
	ContactContextProvider,
	FirmContextProvider,
	ProductContextProvider,
	RequestContextProvider,
	ProjectContextProvider,
	ProjectRequestorsContextProvider,
	SupplierProductContextProvider,
} from "./contexts/ContextProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<ContextProvider>
			<UserContextProvider>
				<useStateContext>
					<ContactContextProvider>
						<FirmContextProvider>
							<ProductContextProvider>
								<RequestContextProvider>
									<ProjectContextProvider>
										<ProjectRequestorsContextProvider>
											<SupplierProductContextProvider>
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
											</SupplierProductContextProvider>
										</ProjectRequestorsContextProvider>
									</ProjectContextProvider>
								</RequestContextProvider>
							</ProductContextProvider>
						</FirmContextProvider>
					</ContactContextProvider>
				</useStateContext>
			</UserContextProvider>
		</ContextProvider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
