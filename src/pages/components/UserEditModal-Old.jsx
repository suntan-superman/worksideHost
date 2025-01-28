/* eslint-disable */
import React, { useState, useCallback, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	Typography,
	MenuItem,
	FormHelperText,
} from "@mui/material";
import { Grid } from "@mui/material";
/**
 * Constants for form configuration
 */
const USER_ROLES = ["ADMIN", "GUEST", "STANDARD"];
const COMPANIES = ["Company A", "Company B", "Chevron"]; // Replace with actual company data

/**
 * Validation rules
 */
const VALIDATION_RULES = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates standard email format
	phone: /^\+?[\d-]{10,}$/, // Allows optional "+" at the beginning, digits, and hyphens with a minimum of 10 characters
};
// const VALIDATION_RULES = {
// 	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
// 	phone: /^\+?[\d\s-]{10,}$/,
// };

/**
 * UserEditModal Component
 * @component
 * Modal for editing user information using Material-UI
 */
const UserEditModal = ({ isOpen, onClose, onSubmit, userData }) => {
	// Form State
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		// phone: "",
		role: "",
		company: "",
		notes: "",
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Reset form when modal opens with new user
	useEffect(() => {
		if (isOpen && userData) {
			console.log(`UserData: ${JSON.stringify(userData)}`);
			setFormData({
				firstname: userData.firstname || "",
				lastname: userData.lastname || "",
				email: userData.email || "",
				// phone: userData.primaryphone || "",
				role: userData.accesslevel || "",
				company: userData.company || "",
				notes: userData.notes || "",
			});
			setErrors({});
		}
	}, [isOpen, userData]);

	useEffect(() => {
		console.log(`FormData: ${JSON.stringify(formData)}`);
	}, [formData]);

	/**
	 * Handle form field changes
	 */
	const handleChange = useCallback((field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[field]: "",
		}));
	}, []);

	/**
	 * Validate form data
	 */
	const validateForm = useCallback(() => {
		const newErrors = {};

		if (!formData.firstname.trim()) {
			newErrors.firstname = "First name is required";
		}
		if (!formData.lastname.trim()) {
			newErrors.lastname = "Last name is required";
		}
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!VALIDATION_RULES.email.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}
		// if (!formData.phone.trim()) {
		// 	newErrors.phone = "Phone is required";
		// } else if (!VALIDATION_RULES.phone.test(formData.phone)) {
		// 	newErrors.phone = "Invalid phone format";
		// }
		if (!formData.role) {
			newErrors.role = "Role is required";
		}
		if (!formData.company) {
			newErrors.company = "Company is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	/**
	 * Handle form submission
	 */
	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error("Error submitting form:", error);
			setErrors((prev) => ({
				...prev,
				submit: "Failed to submit form. Please try again.",
			}));
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, validateForm, onSubmit, onClose]);

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				className: "max-h-[90vh]",
			}}
		>
			<DialogTitle>
				<Box display="flex" justifyContent="center">
					<Typography
						component="span"
						sx={{ color: "green", fontSize: 24, fontWeight: "bold" }}
					>
						WORK
					</Typography>
					<Typography
						component="span"
						sx={{ color: "black", fontSize: 24, fontWeight: "bold" }}
					>
						SIDE
					</Typography>
				</Box>
				{/* Subtitle */}
				<Typography
					sx={{
						color: "black",
						fontSize: 20,
						fontWeight: "normal",
						textAlign: "center",
						marginTop: 1, // Add some spacing between header and subtitle
					}}
				>
					{userData?.firstname} {userData?.lastname}
				</Typography>
			</DialogTitle>
			<DialogContent style={{ paddingTop: "10px" }}>
				<Grid container spacing={2} disableEqualOverflow className="mt-2">
					{/* First Row - Names */}
					<Grid xs={6}>
						<TextField
							fullWidth
							label="First Name"
							value={formData.firstname}
							onChange={(e) => handleChange("firstname", e.target.value)}
							error={!!errors.firstname}
							helperText={errors.firstname}
						/>
					</Grid>
					<Grid xs={6}>
						<TextField
							fullWidth
							label="Last Name"
							value={formData.lastname}
							onChange={(e) => handleChange("lastname", e.target.value)}
							error={!!errors.lastname}
							helperText={errors.lastname}
						/>
					</Grid>

					{/* Second Row - Role and Company */}
					<Grid xs={6}>
						<FormControl fullWidth error={!!errors.role}>
							<InputLabel>Role</InputLabel>
							<Select
								value={formData.role}
								onChange={(e) => handleChange("role", e.target.value)}
								label="Role"
							>
								{USER_ROLES.map((role) => (
									<MenuItem key={role} value={role}>
										{role}
									</MenuItem>
								))}
							</Select>
							{errors.role && <FormHelperText>{errors.role}</FormHelperText>}
						</FormControl>
					</Grid>
					<Grid xs={6}>
						<FormControl fullWidth error={!!errors.company}>
							<InputLabel>Company</InputLabel>
							<Select
								value={formData.company}
								onChange={(e) => handleChange("company", e.target.value)}
								label="Company"
							>
								{COMPANIES.map((company) => (
									<MenuItem key={company} value={company}>
										{company}
									</MenuItem>
								))}
							</Select>
							{errors.company && (
								<FormHelperText>{errors.company}</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Third Row - Email and Phone */}
					<Grid xs={12}>
						<TextField
							fullWidth
							label="Email"
							type="email"
							value={formData.email}
							onChange={(e) => handleChange("email", e.target.value)}
							error={!!errors.email}
							helperText={errors.email}
						/>
					</Grid>
					{/* <Grid2 item xs={6}>
						<TextField
							fullWidth
							label="Phone"
							value={formData.phone}
							onChange={(e) => handleChange("phone", e.target.value)}
							error={!!errors.phone}
							helperText={errors.phone}
						/>
					</Grid2> */}

					{/* Fourth Row - Notes */}
					<Grid xs={12}>
						<TextField
							fullWidth
							label="Notes"
							multiline
							rows={4}
							value={formData.notes}
							onChange={(e) => handleChange("notes", e.target.value)}
						/>
					</Grid>

					{errors.submit && (
						<Grid xs={12}>
							<FormHelperText error>{errors.submit}</FormHelperText>
						</Grid>
					)}
				</Grid>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="inherit" disabled={isSubmitting}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					color="success"
					variant="contained"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Saving..." : "Save Changes"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default React.memo(UserEditModal); 