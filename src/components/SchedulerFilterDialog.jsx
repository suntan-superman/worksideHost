/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Box,
	Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";

/**
 * SchedulerFilterDialog is a React component that provides a dialog interface
 * for filtering projects based on their statuses and associated companies.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to handle closing the dialog.
 * @param {Function} props.onApply - Callback function to handle applying the selected filters.
 * @param {Array<Object>} props.projectData - Array of project objects containing project details.
 * Each project object should have a `customer` property representing the company name.
 *
 * @returns {JSX.Element} A dialog component with filtering options for project statuses and companies.
 *
 * @example
 * <SchedulerFilterDialog
 *   open={isDialogOpen}
 *   onClose={handleDialogClose}
 *   onApply={handleFilterApply}
 *   projectData={[
 *     { id: 1, customer: "Company A" },
 *     { id: 2, customer: "Company B" },
 *   ]}
 * />
 */
const SchedulerFilterDialog = ({ open, onClose, onApply, projectData }) => {
	const [selectedStatuses, setSelectedStatuses] = useState([]);
	const [selectedCompanies, setSelectedCompanies] = useState([]);
	const [availableCompanies, setAvailableCompanies] = useState([]);

	useEffect(() => {
		if (projectData) {
			const companies = [
				...new Set(projectData.map((project) => project.customer)),
			];
			setAvailableCompanies(companies);
		}
	}, [projectData]);

	const projectStatuses = [
		"ACTIVE",
		"COMPLETED",
		"CANCELLED",
		"POSTPONED",
		"PENDING",
	];

	const handleStatusChange = (status) => {
		setSelectedStatuses((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status],
		);
	};

	const handleCompanyChange = (company) => {
		setSelectedCompanies((prev) =>
			prev.includes(company)
				? prev.filter((c) => c !== company)
				: [...prev, company],
		);
	};

	const handleApply = () => {
		onApply({
			statuses: selectedStatuses,
			companies: selectedCompanies,
		});
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<span className="text-bold text-green-300">WORK</span>SIDE Scheduler
				Filter
			</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					<Typography variant="subtitle1" sx={{ mb: 1, color: green[800] }}>
						Project Status
					</Typography>
					<FormGroup>
						{projectStatuses.map((status) => (
							<FormControlLabel
								key={status}
								control={
									<Checkbox
										checked={selectedStatuses.includes(status)}
										onChange={() => handleStatusChange(status)}
										sx={{
											color: green[800],
											"&.Mui-checked": {
												color: green[600],
											},
										}}
									/>
								}
								label={status}
							/>
						))}
					</FormGroup>
				</Box>

				<Box sx={{ mt: 3 }}>
					<Typography variant="subtitle1" sx={{ mb: 1, color: green[800] }}>
						Companies
					</Typography>
					<FormGroup>
						{availableCompanies.map((company) => (
							<FormControlLabel
								key={company}
								control={
									<Checkbox
										checked={selectedCompanies.includes(company)}
										onChange={() => handleCompanyChange(company)}
										sx={{
											color: green[800],
											"&.Mui-checked": {
												color: green[600],
											},
										}}
									/>
								}
								label={company}
							/>
						))}
					</FormGroup>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					color="success"
					onClick={handleApply}
					disabled={
						selectedStatuses.length === 0 && selectedCompanies.length === 0
					}
				>
					Apply Filters
				</Button>
				<Button variant="contained" color="error" onClick={onClose}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SchedulerFilterDialog; 