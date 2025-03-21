/* eslint-disable */

import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import {
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
// import { AuthContext } from "../context/AuthContext";
// import { baseUrl, postRequest } from "../utils/service";

const VerifyEmail = () => {
	const [isLoading, setIsLoading] = useState(false);
  const [ isUserVerified, setIsUserVerified ] = useState(false);
	const [error, setError] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

  window.alert(`Email: ${email} Token: ${token}`);

	useEffect(() => {
    (async () => {
      setIsUserVerified(await isUserValidated(email));
      if (isUserVerified === true) {
				setTimeout(() => {
					return navigate("/");
				}, 3000);
			} else {
				if (token) {
    		// const fetchString = `http://localhost:4000/api/user/verify-email/${token}`;
    		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/verify-email/${token}`;
          const res = await axios.post(fetchString);

          await showSuccessDialogWithTimer("Email successfully verified, redirecting...");

          return navigate("/");
				}
			}
		})();
	}, [token]);

	const isUserValidated = async (email) => {
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/is-user-validated`;
		const res = await axios.post(fetchString, {
			email: email,
    });
		if (res.data.status === false) {
			return false;
		}
		return true;
	};

	return (
		<div>
			{isLoading ? (
				<div>
					<CircularProgress />
				</div>
			) : (
				<div>
					{isUserVerified ? (
						<div>
							<Alert severity="success">
								Email successfully verified, redirecting...
							</Alert>
						</div>
					) : (
						<div>
							{error.error ? (
								<Alert severity="error">{error.message}</Alert>
							) : null}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default VerifyEmail;
