import Swal from "sweetalert2";

/**
 * Custom hook for SweetAlert2 dialogs with predefined configurations
 * @returns {Object} Object containing dialog functions
 */
const useSweetAlert = () => {
	/**
	 * Default configuration for SweetAlert dialogs
	 */
	const defaultConfig = {
		customClass: {
			confirmButton: "btn btn-primary mx-2 px-4 py-2",
			cancelButton: "btn btn-danger mx-2 px-4 py-2",
			denyButton: "btn btn-secondary mx-2 px-4 py-2",
		},
		buttonsStyling: false,
		reverseButtons: true,
		allowOutsideClick: false,
		allowEscapeKey: false,
	};

	/**
	 * Shows a confirmation dialog with Yes/No buttons
	 * @param {Object} options - Configuration options
	 * @param {string} options.title - Dialog title
	 * @param {string} options.text - Dialog message
	 * @param {string} [options.icon='question'] - Dialog icon
	 * @param {Function} options.onConfirm - Callback for confirmation
	 * @param {Function} [options.onCancel] - Callback for cancellation
	 * @returns {Promise<void>}
	 */
	const showConfirmationDialog = async ({
		title,
		text,
		icon = "question",
		onConfirm,
		onCancel,
	}) => {
		try {
			if (!title || !text) {
				throw new Error("Title and text are required for confirmation dialog");
			}

			const result = await Swal.fire({
				...defaultConfig,
				title,
				text,
				icon,
				showCancelButton: true,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
			});

			if (result.isConfirmed && typeof onConfirm === "function") {
				await onConfirm();
			} else if (result.isDismissed && typeof onCancel === "function") {
				await onCancel();
			}
		} catch (error) {
			console.error("Error in confirmation dialog:", error);
			showErrorMessage({
				title: "Error",
				text: "An error occurred while showing the confirmation dialog",
			});
		}
	};

	/**
	 * Shows an error message dialog with OK button
	 * @param {Object} options - Configuration options
	 * @param {string} options.title - Dialog title
	 * @param {string} options.text - Error message
	 * @param {Function} [options.onClose] - Callback when dialog closes
	 * @returns {Promise<void>}
	 */
	const showErrorMessage = async ({ title, text, onClose }) => {
		try {
			if (!title || !text) {
				throw new Error("Title and text are required for error message");
			}

			const result = await Swal.fire({
				...defaultConfig,
				title,
				text,
				icon: "error",
				confirmButtonText: "OK",
				customClass: {
					...defaultConfig.customClass,
					confirmButton: "btn btn-danger mx-2 px-4 py-2",
				},
			});

			if (result.isConfirmed && typeof onClose === "function") {
				await onClose();
			}
		} catch (error) {
			console.error("Error showing error message:", error);
		}
	};

	/**
	 * Shows a warning message dialog with Yes/No buttons
	 * @param {Object} options - Configuration options
	 * @param {string} options.title - Dialog title
	 * @param {string} options.text - Warning message
	 * @param {Function} options.onYes - Callback for Yes button
	 * @param {Function} [options.onNo] - Callback for No button
	 * @returns {Promise<void>}
	 */
	const showWarningMessage = async ({ title, text, onYes, onNo }) => {
		try {
			if (!title || !text) {
				throw new Error("Title and text are required for warning message");
			}

			const result = await Swal.fire({
				...defaultConfig,
				title,
				text,
				icon: "warning",
				showDenyButton: true,
				confirmButtonText: "Yes",
				denyButtonText: "No",
				customClass: {
					...defaultConfig.customClass,
					confirmButton: "btn btn-warning mx-2 px-4 py-2",
				},
			});

			if (result.isConfirmed && typeof onYes === "function") {
				await onYes();
			} else if (result.isDenied && typeof onNo === "function") {
				await onNo();
			}
		} catch (error) {
			console.error("Error in warning dialog:", error);
			showErrorMessage({
				title: "Error",
				text: "An error occurred while showing the warning dialog",
			});
		}
	};

	/**
	 * Shows a success message dialog
	 * @param {Object} options - Configuration options
	 * @param {string} options.title - Dialog title
	 * @param {string} options.text - Success message
	 * @param {Function} [options.onClose] - Callback when dialog closes
	 * @returns {Promise<void>}
	 */
	const showSuccessMessage = async ({ title, text, onClose }) => {
		try {
			if (!title || !text) {
				throw new Error("Title and text are required for success message");
			}

			const result = await Swal.fire({
				...defaultConfig,
				title,
				text,
				icon: "success",
				confirmButtonText: "OK",
				customClass: {
					...defaultConfig.customClass,
					confirmButton: "btn btn-success mx-2 px-4 py-2",
				},
			});

			if (result.isConfirmed && typeof onClose === "function") {
				await onClose();
			}
		} catch (error) {
			console.error("Error showing success message:", error);
			showErrorMessage({
				title: "Error",
				text: "An error occurred while showing the success message",
			});
		}
	};

	return {
		showConfirmationDialog,
		showErrorMessage,
		showWarningMessage,
		showSuccessMessage,
	};
};

export default useSweetAlert;


// import Swal from "sweetalert2";

// /**
//  * Displays a confirmation dialog and waits for user response.
//  * @param {string} message - The message to display in the confirmation dialog.
//  * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
//  */

// const showConfirmationDialog = async (message) => {
// 	return new Promise((resolve) => {
// 		Swal.fire({
// 			position: "top-end",
// 			icon: "question",
// 			title: "WORKSIDE Software",
// 			text: message,
// 			showConfirmButton: true,
// 			confirmButtonText: "Yes",
// 			confirmButtonColor: "#4ADE80",
// 			showCancelButton: true,
// 			cancelButtonColor: "#EF4444",
// 			iconColor: "#4ADE80",
// 			imageWidth: 100,
// 			imageHeight: 100,
// 			width: "400px",
// 			showClass: {
// 				popup: `
//             animate__animated
//             animate__fadeInUp
//             animate__slower
//           `,
// 			},
// 			hideClass: {
// 				popup: `
//             animate__animated
//             animate__fadeOutDown
//             animate__slower
//           `,
// 			},
// 		}).then((result) => {
// 			resolve(result.isConfirmed);
// 		});
// 	});
// };

// export { showConfirmationDialog };
