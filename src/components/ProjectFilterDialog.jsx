/* eslint-disable */  
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

/**
 * A dialog component for filtering projects by company. Allows users to select or deselect companies
 * from a list, apply the selection, or reset the selection to all or none.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {function} props.onClose - Callback function to handle closing the dialog.
 * @param {function} props.onApply - Callback function to handle applying the selected companies.
 * @param {string[]} props.selectedCompanies - The list of companies currently selected.
 * @param {string[]} props.allCompanies - The list of all available companies.
 *
 * @example
 * <ProjectFilterDialog
 *   open={isDialogOpen}
 *   onClose={handleClose}
 *   onApply={handleApply}
 *   selectedCompanies={['Company A', 'Company B']}
 *   allCompanies={['Company A', 'Company B', 'Company C']}
 * />
 */
const ProjectFilterDialog = ({
	open,
	onClose,
	onApply,
	selectedCompanies,
	allCompanies,
}) => {
	const [selections, setSelections] = useState(selectedCompanies);

	// Update selections when selectedCompanies prop changes or dialog opens
	useEffect(() => {
		setSelections(selectedCompanies);
	}, [selectedCompanies, open]);

	const handleToggle = (company) => {
		setSelections((prev) => {
			if (prev.includes(company)) {
				return prev.filter((c) => c !== company);
			}
			return [...prev, company];
		});
	};

	const handleSelectAll = () => {
		setSelections(allCompanies);
	};

	const handleClearAll = () => {
		setSelections([]);
	};

	const handleApply = () => {
		onApply(selections);
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Filter Projects by Company</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						mb: 2,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Button
						onClick={handleSelectAll}
						sx={{
							color: "#2f8842",
							"&:hover": {
								color: "#2f8842",
							},
						}}
					>
						Select All
					</Button>
					<Button
						onClick={handleClearAll}
						sx={{
							color: "#2f8842",
							"&:hover": {
								color: "#2f8842",
							},
						}}
					>
						Clear All
					</Button>
				</Box>
				<FormGroup>
					{allCompanies.map((company) => (
						<FormControlLabel
							key={company}
							control={
								<Checkbox
									checked={selections.includes(company)}
									onChange={() => handleToggle(company)}
									sx={{
										color: "green",
										"&.Mui-checked": {
											color: "green",
										},
									}}
								/>
							}
							label={company}
						/>
					))}
				</FormGroup>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ color: "green" }}>
					Cancel
				</Button>
				<Button
					onClick={handleApply}
					variant="contained"
					sx={{
						bgcolor: "green",
						"&:hover": {
							bgcolor: "darkgreen",
						},
					}}
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProjectFilterDialog; 