/* eslint-disable */
import React, { useState, useCallback, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	TextField,
	FormControl,
	InputLabel,
	Select,
	Typography,
	MenuItem,
	FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Updated import for Grid2
// import Grid from "@mui/material/Unstable_Grid2"; // Updated import for Grid2

/**
 * Constants for form configuration
 */
import {
	accessLevelOptions,
	userStatusOptions,
} from "../../data/worksideOptions";

const USER_ROLES = accessLevelOptions;
const USER_STATUS = userStatusOptions;

// TODO - Replace with actual company data
const COMPANIES = [
	"Baker Hughes",
	"Berry Petroleum",
	"CRC",
	"Chevron",
	"Halliburton",
	"San Joaquin Bit",
]; // Replace with actual company data

/**
 * Validation rules
 */
const VALIDATION_RULES = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	phone: /^\+?[\d\s-]{10,}$/,
};

/**
 * UserEditModal Component
 * @component
 * Modal for editing user information using Material-UI
 */
const UserEditModalX = ({ isOpen, onClose, onSubmit, userData }) => {
	// Form State
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		accesslevel: "",
		company: "",
		status: "",
		comment: "",
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Reset form when modal opens with new user
	useEffect(() => {
		if (isOpen && userData) {
			setFormData({
				firstname: userData.firstname || "",
				lastname: userData.lastname || "",
				email: userData.email || "",
				accesslevel: userData.accesslevel || "GUEST",
				company: userData.company || "",
				status: userData.status || "",
				comment: userData.comment || "",
			});
			setErrors({});
		}
	}, [isOpen, userData]);

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
		if (!formData.accesslevel) {
			newErrors.accesslevel = "Access Level is required";
		}
		if (!formData.company) {
			newErrors.company = "Company is required";
		}
		if (!formData.status) {
			newErrors.status = "Status is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	/**
	 * Handle form submission
	 */
	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			console.log("Form validation failed");
			return;
		}

		setIsSubmitting(true);
		try {
			// localStorage.setItem("newAccessLevel", formData.accesslevel);

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
			maxWidth="sm"
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
				<Grid container spacing={2} columns={12}>
					{/* First Row - Names */}
					<Grid size={6}>
						<TextField
							disabled
							variant="outlined"
							sx={
								{
									// border: "1px solid red",
									// height: 40,
									// borderRadius: 3,
								}
							}
							fullWidth
							label="First Name *"
							value={formData.firstname}
							onChange={(e) => handleChange("firstname", e.target.value)}
							error={!!errors.firstname}
							helperText={errors.firstname}
						/>
					</Grid>
					<Grid size={6}>
						<TextField
							disabled
							variant="outlined"
							fullWidth
							label="Last Name *"
							value={formData.lastname}
							onChange={(e) => handleChange("lastname", e.target.value)}
							error={!!errors.lastname}
							helperText={errors.lastname}
						/>
					</Grid>

					{/* Second Row - Company and Access Level */}
					<Grid size={6}>
						<FormControl fullWidth error={!!errors.company}>
							<InputLabel>Company</InputLabel>
							<Select
								disabled
								variant="outlined"
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
					<Grid size={6}>
						<FormControl fullWidth error={!!errors.accesslevel}>
							<InputLabel>Access Level</InputLabel>
							<Select
								value={formData.accesslevel}
								onChange={(e) => handleChange("accesslevel", e.target.value)}
								label="Access Level"
							>
								{USER_ROLES.map((accesslevel) => (
									<MenuItem key={accesslevel} value={accesslevel}>
										{accesslevel}
									</MenuItem>
								))}
							</Select>
							{errors.accesslevel && (
								<FormHelperText>{errors.accesslevel}</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Third Row - Email */}
					<Grid size={8}>
						<TextField
							disabled
							variant="outlined"
							fullWidth
							label="Email"
							type="email"
							value={formData.email}
							onChange={(e) => handleChange("email", e.target.value)}
							error={!!errors.email}
							helperText={errors.email}
						/>
					</Grid>
					<Grid size={4}>
						<FormControl fullWidth error={!!errors.status}>
							<InputLabel>Status</InputLabel>
							<Select
								value={formData.status}
								onChange={(e) => handleChange("status", e.target.value)}
								label="Access Level"
							>
								{USER_STATUS.map((status) => (
									<MenuItem key={status} value={status}>
										{status}
									</MenuItem>
								))}
							</Select>
							{errors.status && (
								<FormHelperText>{errors.status}</FormHelperText>
							)}
						</FormControl>
					</Grid>

					{/* Fourth Row - Comment */}
					<Grid size={12}>
						<TextField
							fullWidth
							label="Comments"
							multiline
							rows={4}
							value={formData.comment}
							onChange={(e) => handleChange("comment", e.target.value)}
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

export default React.memo(UserEditModalX); 
