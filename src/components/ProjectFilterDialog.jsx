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

const ProjectFilterDialog = ({ open, onClose, onApply, selectedCompanies, allCompanies }) => {
  const [selections, setSelections] = useState(selectedCompanies);

  // Update selections when selectedCompanies prop changes or dialog opens
		useEffect(() => {
			setSelections(selectedCompanies);
		}, [selectedCompanies, open]);

  const handleToggle = (company) => {
    setSelections(prev => {
      if (prev.includes(company)) {
        return prev.filter(c => c !== company);
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