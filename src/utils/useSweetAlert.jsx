/* eslint-disable */
import Swal from "sweetalert2";

const defaultConfig = {
	// customClass: {
	// 	confirmButton: "btn btn-primary mx-2 px-4 py-2",
	// 	cancelButton: "btn btn-danger mx-2 px-4 py-2",
	// 	denyButton: "btn btn-secondary mx-2 px-4 py-2",
	// },
	// buttonsStyling: false,
	reverseButtons: true,
	allowOutsideClick: false,
	allowEscapeKey: false,
};

const worksideTitle =
	'<span style="color: #16A34A; font-size: 28px; font-weight: bold;">WORK</span>' +
	'<span style="color: black; font-size: 28px; font-weight: bold;">SIDE</span>';

/**
 * Displays a confirmation dialog and waits for user response.
 * @param {string} message - The message to display in the confirmation dialog.
 * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
 */

const showConfirmationDialog = async (message) => {
	return new Promise((resolve) => {
		Swal.fire({
			...defaultConfig,
			position: "top-end",
			// icon: "question",
			title: worksideTitle,
			html: `<strong style="color: #16A34A; font-size: 20px; font-weight: bold;">${message}</strong>`,
			background: "#E5E7EB",
			showConfirmButton: true,
			confirmButtonText: "Yes",
			confirmButtonColor: "#4ADE80",
			cancelButtonText: "No",
			showCancelButton: true,
			cancelButtonColor: "#EF4444",
			iconColor: "#4ADE80",
			reverseButtons: false,
			imageWidth: null,
			imageHeight: null,
			width: "400px",
			// height: "400px",
			customClass: {
				popup: "custom-dialog", // Adds custom border to the dialog box
				confirmButton: "custom-confirm-button",
				cancelButton: "custom-cancel-button",
			},
			showClass: {
				popup: `
            animate__animated
            animate__fadeInUp
            animate__slower
          `,
			},
			hideClass: {
				popup: `
            animate__animated
            animate__fadeOutDown
            animate__slower
          `,
			},
		}).then((result) => {
			resolve(result.isConfirmed);
		});
	});
};

/**
 * Displays an error dialog and waits for user response.
 * @param {string} message - The message to display in the error dialog.
 * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
 */

const showErrorDialog = async (message) => {
	return new Promise((resolve) => {
		Swal.fire({
			...defaultConfig,
			position: "top-end",
			// icon: "error",
			title: worksideTitle,
			html: `<strong style="color: red; font-size: 20px; font-weight: bold;">${message}</strong>`,
			showConfirmButton: true,
			confirmButtonText: "OK",
			confirmButtonColor: "#EF4444",
			cancelButtonText: "No",
			iconColor: "#EF4444",
			imageWidth: null,
			imageHeight: null,
			width: "400px",
			// height: "400px",
			customClass: {
				popup: "custom-dialog", // Adds custom border to the dialog box
				confirmButton: "custom-cancel-button",
			},
			showClass: {
				popup: `
            animate__animated
            animate__fadeInUp
            animate__slower
          `,
			},
			hideClass: {
				popup: `
            animate__animated
            animate__fadeOutDown
            animate__slower
          `,
			},
		}).then((result) => {
			resolve(result.isConfirmed);
		});
	});
};

/**
 * Displays a warning dialog and waits for user response.
 * @param {string} message - The message to display in the warning dialog.
 * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
 */

const showWarningDialog = async (message) => {
	return new Promise((resolve) => {
		Swal.fire({
			...defaultConfig,
			position: "top-end",
			// icon: "warning",
			title: worksideTitle,
			html: `<strong style="color: red; font-size: 20px; font-weight: bold;">${message}</strong>`,
			showConfirmButton: true,
			confirmButtonText: "Yes",
			confirmButtonColor: "#4ADE80",
			showDenyButton: true,
			denyButtonText: "No",
			iconColor: "#EF4444",
			imageWidth: null,
			imageHeight: null,
			reverseButtons: false,
			width: "400px",
			// height: "400px",
			customClass: {
				popup: "custom-dialog", // Adds custom border to the dialog box
				confirmButton: "custom-confirm-button",
				denyButton: "custom-cancel-button",
			},
			showClass: {
				popup: `
            animate__animated
            animate__fadeInUp
            animate__slower
          `,
			},
			hideClass: {
				popup: `
            animate__animated
            animate__fadeOutDown
            animate__slower
          `,
			},
		}).then((result) => {
			resolve(result.isConfirmed);
		});
	});
};

/**
 * Displays a success dialog and waits for user response.
 * @param {string} message - The message to display in the success dialog.
 * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
 */

const showSuccessDialog = async (message) => {
	return new Promise((resolve) => {
		Swal.fire({
			// ...defaultConfig,
			position: "top-end",
			// icon: "success",
			title: worksideTitle,
			html: `<strong style="color: #16A34A; font-size: 20px; font-weight: bold;">${message}</strong>`,
			showConfirmButton: true,
			confirmButtonText: "OK",
			confirmButtonColor: "#4ADE80",
			iconColor: "#4ADE80",
			// imageWidth: 25,
			// imageHeight: 25,
			width: "400px",
			// height: "400px",
			customClass: {
				popup: "custom-dialog", // Adds custom border to the dialog box
				confirmButton: "custom-confirm-button",
			},
			showClass: {
				popup: `
            animate__animated
            animate__fadeInUp
            animate__slower
          `,
			},
			hideClass: {
				popup: `
            animate__animated
            animate__fadeOutDown
            animate__slower
          `,
			},
		}).then((result) => {
			resolve(result.isConfirmed);
		});
	});
};

/**
 * Displays a success dialog and waits for user response.
 * @param {string} message - The message to display in the success dialog.
 * @returns {Promise<boolean>} - Resolves to true if the user confirms, otherwise false.
 */

const showSuccessDialogWithTimer = async (message) => {
	let timerInterval;
	return new Promise((resolve) => {
		Swal.fire({
			...defaultConfig,
			position: "top-end",
			title: worksideTitle,
			html: `<strong>${message}</strong><br/>Closing in <b></b> milliseconds.`,
			showConfirmButton: true,
			confirmButtonText: "OK",
			confirmButtonColor: "#4ADE80",
			iconColor: "#4ADE80",
			imageWidth: 100,
			imageHeight: 100,
			width: null,
			// height: null,
			customClass: {
				popup: "custom-dialog", // Adds custom border to the dialog box
				confirmButton: "custom-confirm-button",
				title: "custom-title",
			},
			showClass: {
				popup: `
            animate__animated
            animate__fadeInUp
            animate__slower
          `,
			},
			hideClass: {
				popup: `
            animate__animated
            animate__fadeOutDown
            animate__slower
          `,
			},
			timer: 3000, // 3 seconds
			timerProgressBar: true,
			didOpen: () => {
				Swal.showLoading();
				const timer = Swal.getPopup().querySelector("b");
				timerInterval = setInterval(() => {
					timer.textContent = `${Swal.getTimerLeft()}`;
				}, 100);
			},
			willClose: () => {
				clearInterval(timerInterval);
			},
		}).then((result) => {
			resolve(result.isConfirmed);
		});
	});
};

const style = document.createElement("style");
style.innerHTML = `
/* Title font size */
  .custom-title {
    font-size: 30px !important;
    color: green !important; 
  }
/* Dialog box border */
/*    border: 4px solid black !important; */
  .custom-dialog {
    border-top: 3px solid black !important;
    border-left: 3px solid black !important;
    border-right: 6px solid black !important;
    border-bottom: 6px solid black !important;  
    border-radius: 8px !important;
    padding: 10px !important;
  }
  .custom-confirm-button, .custom-cancel-button {
    width: 120px !important;
    color: black !important; /* Button text color */
    border-top: 2px solid black !important;
    border-left: 2px solid black !important;
    border-right: 4px solid black !important;
    border-bottom: 4px solid black !important;
  }
`;
document.head.appendChild(style);

export {
	showConfirmationDialog,
	showErrorDialog,
	showWarningDialog,
	showSuccessDialog,
	showSuccessDialogWithTimer,
};
