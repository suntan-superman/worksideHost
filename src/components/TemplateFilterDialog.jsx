/* eslint-disable */
import React from "react";
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
} from "@mui/material";

const TemplateFilterDialog = ({
	open,
	onClose,
	onApply,
	selectedVisibilities,
}) => {
	const [tempSelected, setTempSelected] = React.useState(selectedVisibilities);

	const handleToggle = (visibility) => {
		setTempSelected((prev) =>
			prev.includes(visibility)
				? prev.filter((v) => v !== visibility)
				: [...prev, visibility],
		);
	};

	const handleApply = () => {
		onApply(tempSelected);
	};

	const handleCancel = () => {
		setTempSelected(selectedVisibilities);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleCancel}>
			<DialogTitle>Filter Templates by Visibility</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					<FormGroup>
						<FormControlLabel
							control={
								<Checkbox
									checked={tempSelected.includes("private")}
									onChange={() => handleToggle("private")}
									color="primary"
								/>
							}
							label="Private"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={tempSelected.includes("public")}
									onChange={() => handleToggle("public")}
									color="primary"
								/>
							}
							label="Public"
						/>
					</FormGroup>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleApply} variant="contained" color="primary">
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TemplateFilterDialog; 