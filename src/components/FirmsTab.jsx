import React, { useState } from "react";
import { Dialog } from "@syncfusion/ej2-react-popups";
import { FirmEditTemplate } from "./FirmEditTemplate";
import { SaveFirm, GetAllFirms } from "../api/worksideAPI";
import { showErrorDialog, showSuccessDialog } from "../utils/useSweetAlert";

const FirmsTab = () => {
	const [firms, setFirms] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [dialogData, setDialogData] = useState({});
	const [isAdd, setIsAdd] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [lastCoordinates, setLastCoordinates] = useState({
		lat: null,
		lng: null,
	});

	const handleFirmSave = async (firmData) => {
		try {
			if (!isValid) {
				showErrorDialog("Please fill in all required fields");
				return;
			}

			// If it's a supplier, ensure coordinates are set
			if (firmData.type === "SUPPLIER" && (!firmData.lat || !firmData.lng)) {
				showErrorDialog(
					"Please ensure the address is valid and coordinates are set",
				);
				return;
			}

			// Store coordinates for next use
			if (firmData.lat && firmData.lng) {
				setLastCoordinates({ lat: firmData.lat, lng: firmData.lng });
			}

			// Save the firm data
			const response = await SaveFirm(firmData);
			if (response.success) {
				showSuccessDialog("Firm saved successfully");
				handleDialogClose();
				// Refresh the firms list
				const updatedFirms = await GetAllFirms();
				setFirms(updatedFirms.data);
			} else {
				showErrorDialog(response.message || "Error saving firm");
			}
		} catch (error) {
			console.error("Error saving firm:", error);
			showErrorDialog("Error saving firm. Please try again.");
		}
	};

	const handleFirmAdd = () => {
		setIsAdd(true);
		setDialogData({
			status: "ACTIVE",
			statusdate: new Date(),
			...lastCoordinates, // Pre-fill with last used coordinates
		});
		setShowDialog(true);
	};

	const handleFormChange = (formData) => {
		setDialogData(formData);
		setIsValid(formData.isValid || false);
	};

	const handleDialogClose = () => {
		setShowDialog(false);
		setIsAdd(false);
		setDialogData({});
		setIsValid(false);
	};

	return (
		<div className="p-4">
			<Dialog
				visible={showDialog}
				width="650px"
				height="auto"
				header={isAdd ? "Add New Firm" : "Edit Firm"}
				showCloseIcon={true}
				closeOnEscape={true}
				animationSettings={{ effect: "Zoom" }}
				position={{ X: "center", Y: "center" }}
				close={handleDialogClose}
				buttons={[
					{
						buttonModel: {
							content: "Save",
							isPrimary: true,
							cssClass: "e-flat",
							disabled: !isValid,
						},
						click: () => handleFirmSave(dialogData),
					},
					{
						buttonModel: {
							content: "Cancel",
							cssClass: "e-flat",
						},
						click: handleDialogClose,
					},
				]}
			>
				<FirmEditTemplate
					{...dialogData}
					isAdd={isAdd}
					onChange={handleFormChange}
				/>
			</Dialog>
		</div>
	);
};

export default FirmsTab; 