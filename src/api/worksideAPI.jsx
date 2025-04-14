/* eslint-disable */
import axios from "axios";
import { format } from "date-fns";

const apiURL = "https://workside-software.wl.r.appspot.com";

/******************************************************************************
 * Core Utility Functions
 ******************************************************************************/

/**
 * Extracts selected fields from firm data.
 * @param {Array} dataArray - The array of firm objects.
 * @returns {Array} - Filtered array with selected fields.
 */
const extractFirmFields = (dataArray) => {
    if (!Array.isArray(dataArray)) return [];
    return dataArray.map(({ _id, type, area, name, status }) => ({
        _id,
        type,
        area,
        name,
        status,
    }));
};

/**
 * Handles API requests with error handling.
 * @param {string} endpoint - The API endpoint.
 * @param {object} [options] - Fetch options.
 * @returns {Promise<object>} - API response or error object.
 */
const fetchWithHandling = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${apiURL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        return { status: error?.response?.status || 500, data: [] };
    }
};

/**
 * Handles API requests with Axios for POST/PUT/PATCH/DELETE.
 * @param {string} endpoint - API endpoint.
 * @param {string} method - HTTP method.
 * @param {object} payload - Request payload.
 * @returns {Promise<object>} - API response or error object.
 */
const apiRequest = async (endpoint, method, payload) => {
    try {
        const response = await axios({
            method,
            url: `${apiURL}${endpoint}`,
            data: payload,
            headers: { "Content-Type": "application/json" },
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error(`API Error: ${error.message}`);
        return { status: error?.response?.status || 500, data: [] };
    }
};

/**
 * Cleans up a string by removing double quotes and trimming whitespace
 * @param {string} url - The string to clean
 * @returns {string} - The cleaned string
 */
const cleanUpStr = (url) => {
    let formattedStr = url.replace(/"([^"]*)"/g, "$1");
    formattedStr = formattedStr.trimStart();
    formattedStr = formattedStr.trimEnd();
    return formattedStr;
};

/******************************************************************************
 * Firm-related Functions
 ******************************************************************************/

/**
 * Fetch all firms from the API.
 * @returns {Promise<object>} - Firms data or empty array.
 */
const GetAllFirms = async () => fetchWithHandling("/api/firm");

/**
 * Fetch all firm names for selection.
 * @returns {Promise<object>} - Firm names data or empty array.
 */
const GetAllFirmsForSelection = async () =>
    fetchWithHandling("/api/firm/allFirmNames");

/**
 * Fetch all firms of type SUPPLIER.
 * @returns {Promise<object>} - Supplier firms data or empty array.
 */
const GetAllSuppliers = async () => {
    const { status, data } = await fetchWithHandling("/api/firm");
    return { status, data: data.filter((firm) => firm.type === "SUPPLIER") };
};

/**
 * Fetch all firms of type RIGCOMPANY.
 * @returns {Promise<object>} - Rig company firms data or empty array.
 */
const GetAllRigCompanies = async () => {
    const { status, data } = await fetchWithHandling("/api/firm");
    return { status, data: data.filter((firm) => firm.type === "RIGCOMPANY") };
};

/**
 * Fetch all firms of type CUSTOMER.
 * @returns {Promise<object>} - Customer firms data or empty array.
 */
const GetAllCustomers = async () => {
    const { status, data } = await fetchWithHandling("/api/firm");
    return { status, data: data.filter((firm) => firm.type === "CUSTOMER") };
};

/**
 * Fetches and extracts firm names for selection options.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and firm options.
 */
const GetFirmOptions = async () => {
    try {
        const firmsResponse = await GetAllFirms();

        if (!firmsResponse || !Array.isArray(firmsResponse) || !firmsResponse[0]?.data) {
            throw new Error("Invalid data format received from GetAllFirms");
        }

        const firmOptions = firmsResponse[0].data
            .filter((firm) => typeof firm.name === "string")
            .map((firm) => firm.name);

        return { status: 200, data: firmOptions };
    } catch (error) {
        console.error("Error fetching firm options:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetch firm ID based on firm name.
 * @param {string} firm - Firm name to search.
 * @returns {Promise<object>} - Firm ID or empty object.
 */
const GetFirmID = async (firm) => {
    const { status, data } = await GetAllFirms();
    const firmData = data.find((r) => r.name === firm);
    return { status, firmID: firmData?._id || null };
};

/**
 * Fetch firm TYPE based on firm name.
 * @param {string} firm - Firm name to search.
 * @returns {Promise<object>} - Firm type or empty object.
 */
const GetFirmType = async (firm) => {
    const { status, data } = await GetAllFirms();
    const firmData = data.find((r) => r.name === firm);
    return { status, firmType: firmData?.type || null };
};

/**
 * Fetches and extracts customer names for selection options.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and customer options.
 */
const GetCustomerOptions = async () => {
    try {
        const customersResponse = await GetAllCustomers();

        if (!customersResponse || !Array.isArray(customersResponse) || !customersResponse[1]) {
            throw new Error("Invalid data format received from GetAllCustomers");
        }

        const customerOptions = customersResponse[1]
            .filter((customer) => typeof customer.name === "string")
            .map((customer) => customer.name);

        return { status: 200, data: customerOptions };
    } catch (error) {
        console.error("Error fetching customer options:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches and extracts supplier names for selection options.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and supplier options.
 */
const GetSupplierOptions = async () => {
    try {
        const suppliersResponse = await GetAllSuppliers();

        if (!suppliersResponse || !Array.isArray(suppliersResponse.data)) {
            throw new Error("Invalid data format received from GetAllSuppliers");
        }

        const supplierOptions = suppliersResponse.data
            .filter((supplier) => typeof supplier.name === "string")
            .map((supplier) => supplier.name);

        return { status: 200, data: supplierOptions };
    } catch (error) {
        console.error("Error fetching supplier options:", error.message);
        return { status: 500, data: [] };
    }
};

/******************************************************************************
 * Contact-related Functions
 ******************************************************************************/

/**
 * Fetch all contacts from the API.
 * @returns {Promise<object>} - Contact data or empty array.
 */
const GetAllContacts = async () => fetchWithHandling("/api/contact");

/**
 * Fetch contact ID by email from the API.
 * @param {string} email - Email address to look up
 * @returns {Promise<object>} - Contact ID or error object
 */
const GetContactIDByEmail = async (email) => { 
    try {
        const response = await axios.get(`${apiURL}/api/contact/email/${email}`);
        return { status: response.status, data: response.data._id };
    } catch (error) {
        console.error("Error fetching contact ID by email:", error.message);
        return { status: error.response?.status || 500 };
    }
};

/**
 * Fetch contacts based on firm name.
 * @param {string} firm - Firm name to filter contacts.
 * @returns {Promise<object>} - Filtered contacts or empty array.
 */
const GetContactsByFirm = async (firm) => {
    const { status, data } = await fetchWithHandling("/api/contact");
    return { status, data: data.filter((contact) => contact.firm === firm) };
};

/**
 * Fetches and extracts contact usernames for selection options.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and contact options.
 */
const GetContactOptions = async () => {
    try {
        const contactsResponse = await GetAllContacts();

        if (!contactsResponse || !Array.isArray(contactsResponse) || !contactsResponse[0]) {
            throw new Error("Invalid data format received from GetAllContacts");
        }

        const contactOptions = contactsResponse[0]
            .filter((contact) => typeof contact.username === "string")
            .map((contact) => contact.username);

        return { status: 200, data: contactOptions };
    } catch (error) {
        console.error("Error fetching contact options:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches the contact ID based on the given username.
 * @param {string} contact - The username of the contact to find.
 * @returns {Promise<{ status: number, data: string | null }>} - A promise resolving to status and contact ID.
 */
const GetContactID = async (contact) => {
    if (!contact || typeof contact !== "string") {
        console.error("Invalid contact parameter provided.");
        return { status: 400, data: null };
    }
    try {
        const contacts = await GetAllContacts();
        if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
            throw new Error("Invalid data format received from GetAllContacts");
        }

        const foundContact = contacts.find((r) => r.username === contact);
        if (!foundContact) {
            throw new Error("Contact not found");
        }

        return { status: 200, data: foundContact._id };
    } catch (error) {
        console.error("Error fetching contact ID:", error.message);
        return { status: 500, data: null };
    }
};

/******************************************************************************
 * Request-related Functions
 ******************************************************************************/

/**
 * Retrieves Customer-Supplier MSA data by ID.
 * @param {string} id - The ID of the customer-supplier MSA.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and MSA data.
 */
const GetCustomerSupplierMSAData = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/customersuppliermsa/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch MSA data with status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching MSA data:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Retrieves supplier group data by ID.
 * @param {string} id - The supplier group ID.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and supplier group data.
 */
const GetSupplierGroupData = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/suppliergroup/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch supplier group data with status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching supplier group data:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches all requests from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and all request data.
 */
const GetAllRequests = async () => {
    try {
        const response = await fetch(`${apiURL}/api/request`);
        if (!response.ok) {
            throw new Error(`Failed to fetch requests with status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching all requests:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches all requests associated with a specific project ID.
 * @param {string} projectId - The project ID for filtering requests.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and project-specific request data.
 */
const GetAllRequestsByProject = async (projectId) => {
    if (!projectId || typeof projectId !== "string") {
        console.error("Invalid project ID provided.");
        return { status: 400, data: [] };
    }
    try {
        const response = await fetch(`${apiURL}/api/request/byprojectid/${projectId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch project requests with status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching requests by project:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Save a new request to the API.
 * @param {object} reqData - Request data to save.
 * @returns {Promise<object>} - API response or error object.
 */
const SaveNewRequest = async (reqData) => apiRequest("/api/request", "POST", reqData);

/**
 * Update an existing request.
 * @param {string} reqID - Request ID to update.
 * @param {object} reqData - Updated request data.
 * @returns {Promise<object>} - API response or error object.
 */
const UpdateRequest = async (reqID, reqData) =>
    apiRequest(`/api/request/${reqID}`, "PATCH", reqData);

/**
 * Save a new request bid.
 * @param {object} reqBidData - Request bid data to save.
 * @returns {Promise<object>} - API response or error object.
 */
const SaveRequestBid = async (reqBidData) => 
    apiRequest("/api/requestbid", "POST", reqBidData);

/**
 * Update an existing request bid.
 * @param {object} reqBidData - Updated request bid data.
 * @returns {Promise<object>} - API response or error object.
 */
const UpdateRequestBid = async (reqBidData) => 
    apiRequest("/api/requestbid", "PATCH", reqBidData);

/**
 * Check if a request bid exists for a supplier.
 * @param {string} reqID - Request ID
 * @param {string} supplierID - Supplier ID
 * @returns {Promise<{status: number, data?: object}>} - Status and existing bid data if found
 */
const DoesRequestBidExist = async (reqID, supplierID) => {
    const strAPI = `${apiURL}/api/requestbid/doesBidExist`;
    const body = {
        requestid: reqID,
        supplierid: supplierID,
    };

    try {
        const response = await axios.post(strAPI, body);
        if (response.status === 200) {
            return { status: 200, data: response.data };
        }
        return { status: 400 };
    } catch (error) {
        return { status: 500 };
    }
};

/**
 * Fetches request bids from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to the status and bids data.
 */
const GetRequestBids = async () => {
    try {
        const response = await fetch(`${apiURL}/api/requestbidsview`);
        if (!response.ok) {
            throw new Error(`Failed to fetch request bids. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching request bids:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Updates the status of a request.
 * @param {object} params - Parameters object.
 * @param {string} params.reqID - The ID of the request to update.
 * @param {string} params.status - The new status to set.
 * @returns {Promise<{ status: number }>} - A promise resolving to the request status.
 */
const UpdateRequestStatus = async ({ reqID, status }) => {
    if (!reqID || !status) {
        console.error("Invalid parameters provided to UpdateRequestStatus.");
        return { status: 400 };
    }
    try {
        const response = await axios.patch(`${apiURL}/api/request`, {
            id: reqID,
            status: status,
        });
        return { status: response.status };
    } catch (error) {
        console.error("Error updating request status:", error.message);
        return { status: error.response?.status || 500 };
    }
};

/**
 * Updates the status of all request bids.
 * @param {object} params - Parameters object.
 * @param {string} params.reqID - The ID of the request.
 * @param {string} params.status - The new status to set.
 * @returns {Promise<{ status: number }>} - A promise resolving to the request status.
 */
const SetRequestBidsStatus = async ({ reqID, status }) => {
    if (!reqID || !status) {
        console.error("Invalid parameters provided to SetRequestBidsStatus.");
        return { status: 400 };
    }
    try {
        const response = await axios.patch(`${apiURL}/api/requestbid/setstatus`, {
            requestid: reqID,
            status: status,
        });
        return { status: response.status };
    } catch (error) {
        console.error("Error updating request bids status:", error.message);
        return { status: error.response?.status || 500 };
    }
};

/**
 * Updates the status of the awarded request bid.
 * @param {object} params - Parameters object.
 * @param {string} params.reqID - The ID of the request.
 * @param {string} params.supplierID - The ID of the supplier.
 * @returns {Promise<{ status: number }>} - A promise resolving to the request status.
 */
const SetAwardedRequestBidStatus = async ({ reqID, supplierID }) => {
    if (!reqID || !supplierID) {
        console.error("Invalid parameters provided to SetAwardedRequestBidStatus.");
        return { status: 400 };
    }
    try {
        const response = await axios.patch(`${apiURL}/api/requestbid/setawarded`, {
            requestid: reqID,
            supplierid: supplierID,
        });
        return { status: response.status };
    } catch (error) {
        console.error("Error updating awarded request bid status:", error.message);
        return { status: error.response?.status || 500 };
    }
};

/**
 * Fetches delivery associates from the API.
 * @param {string} supplierId - Optional supplier ID to filter delivery associates.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and delivery associates data.
 */
const GetDeliveryAssociates = async (supplierId) => {
	try {
		const response = await fetch(`${apiURL}/api/deliveryassociate`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch delivery associates. Status: ${response.status}`,
			);
		}
		const json = await response.json();

		// Filter by supplier ID if provided
		const filteredData = supplierId
			? json.filter((da) => da.supplierid === supplierId)
			: json;

		return { status: response.status, data: filteredData };
	} catch (error) {
		console.error("Error fetching delivery associates:", error.message);
		return { status: 500, data: [] };
	}
};

/**
 * Fetches supplier information by ID.
 * @param {string} id - The supplier ID.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and supplier data.
 */
const GetSupplierInfoFromID = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid supplier ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/firm/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch supplier info. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching supplier info:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches supplier ID from supplier name.
 * @param {string} name - The supplier name.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and supplier ID.
 */
const GetSupplierIDFromName = async (name) => {
	if (!name || typeof name !== "string") {
		console.error("Invalid Name provided to GetSupplierIDFromName.");
		return [{ status: 400, data: [] }];
	}
	try {
		const response = await fetch(`${apiURL}/api/firm/getSupplierIdByName/${name}`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch Supplier ID. Status: ${response.status}`,
			);
		}

		const json = await response.json();
		return [{ status: response.status, data: json }];
	} catch (error) {
		console.error("Error fetching supplier info:", error.message);
		return [{ status: 500, data: [] }];
	}
};

/**
 * Fetches requests by customer.
 * @param {string} customer - The customer name.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and request data.
 */
const GetRequestsByCustomer = async (clientName) => {
	const cleanCustomer = cleanUpStr(clientName);

	if (!cleanCustomer || typeof cleanCustomer !== "string") {
		console.error("Invalid customer name provided.");
		return { status: 400, data: [] };
	}
console.log(`Customer Name: ${cleanCustomer}`);
	try {
		const response = await fetch(
			`${apiURL}/api/request/bycustomername/${cleanCustomer}`,
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch customer requests. Status: ${response.status}`,
			);
		}

		const json = await response.json();
		return { status: response.status, data: json };
	} catch (error) {
		console.error("Error fetching customer requests:", error.message);
		return { status: 500, data: [] };
	}
};

/**
 * Fetches request data by ID.
 * @param {string} id - The request ID.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and request data.
 */
const GetRequestData = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid request ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/request/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch request data. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching request data:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches request options from the API.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and request options.
 */
const GetRequestOptions = async () => {
    try {
        const response = await fetch(`${apiURL}/api/request`);
        if (!response.ok) {
            throw new Error(`Failed to fetch request options. Status: ${response.status}`);
        }

        const json = await response.json();
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const requestOptions = json
            .filter((request) => typeof request.name === "string")
            .map((request) => request.name);

        return { status: response.status, data: requestOptions };
    } catch (error) {
        console.error("Error fetching request options:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches request ID based on request name.
 * @param {string} request - The request name to look up.
 * @returns {Promise<{ status: number, data: string | null }>} - A promise resolving to status and request ID.
 */
const GetRequestID = async (request) => {
    if (!request || typeof request !== "string") {
        console.error("Invalid request name provided.");
        return { status: 400, data: null };
    }
    try {
        const { status, data } = await GetAllRequests();
        const requestData = data.find((r) => r.name === request);
        return { status, data: requestData?._id || null };
    } catch (error) {
        console.error("Error fetching request ID:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches request category options from the API.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and category options.
 */
const GetRequestCategoryOptions = async () => {
    try {
        const response = await fetch(`${apiURL}/api/requestcategory`);
        if (!response.ok) {
            throw new Error(`Failed to fetch category options. Status: ${response.status}`);
        }

        const json = await response.json();
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const categoryOptions = json
            .filter((category) => typeof category.name === "string")
            .map((category) => category.name);

        return { status: response.status, data: categoryOptions };
    } catch (error) {
        console.error("Error fetching category options:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches request category ID based on category name.
 * @param {string} category - The category name to look up.
 * @returns {Promise<{ status: number, data: string | null }>} - A promise resolving to status and category ID.
 */
const GetRequestCategoryID = async (category) => {
    if (!category || typeof category !== "string") {
        console.error("Invalid category name provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/requestcategory`);
        if (!response.ok) {
            throw new Error(`Failed to fetch category data. Status: ${response.status}`);
        }

        const json = await response.json();
        const categoryData = json.find((c) => c.name === category);
        return { status: response.status, data: categoryData?._id || null };
    } catch (error) {
        console.error("Error fetching category ID:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches request status options from the API.
 * @returns {Promise<{ status: number, data: string[] }>} - A promise resolving to status and status options.
 */
const GetRequestStatusOptions = async () => {
    try {
        const response = await fetch(`${apiURL}/api/requeststatus`);
        if (!response.ok) {
            throw new Error(`Failed to fetch status options. Status: ${response.status}`);
        }

        const json = await response.json();
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const statusOptions = json
            .filter((status) => typeof status.name === "string")
            .map((status) => status.name);

        return { status: response.status, data: statusOptions };
    } catch (error) {
        console.error("Error fetching status options:", error.message);
        return { status: 500, data: [] };
    }
};

/******************************************************************************
 * User Authentication Functions
 ******************************************************************************/

/**
 * Fetches all users from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and user data.
 */
const GetAllUsers = async () => {
    try {
        const response = await fetch(`${apiURL}/api/user`);
        if (!response.ok) {
            throw new Error(`Failed to fetch users. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Initiates password reset process for a user.
 * @param {string} email - User's email address.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserForgotPassword = async (email) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/forgotpassword`, { email });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserForgotPassword:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Checks if a user exists in the system.
 * @param {string} email - User's email address.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserDoesExist = async (email) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/doesexist`, { email });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserDoesExist:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Resets a user's password using a reset token.
 * @param {string} token - Password reset token.
 * @param {string} password - New password.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserResetPassword = async (token, password) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/resetpassword`, {
            token: token.trim(),
            password: password.trim(),
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserResetPassword:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Changes a user's password.
 * @param {string} oldPassword - Current password.
 * @param {string} newPassword - New password.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserChangePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/changepassword`, {
            oldpassword: oldPassword.trim(),
            newpassword: newPassword.trim(),
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserChangePassword:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Authenticates a user login.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserLogin = async (email, password) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/login`, {
            email: email.trim(),
            password: password.trim(),
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserLogin:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Registers a new user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserRegister = async (email, password) => {
    try {
        const response = await axios.post(`${apiURL}/api/user/register`, {
            email: email.trim(),
            password: password.trim(),
        });
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserRegister:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Logs out the current user.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserLogout = async () => {
    try {
        const response = await axios.post(`${apiURL}/api/user/logout`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserLogout:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/**
 * Checks if the current user is authenticated.
 * @returns {Promise<{status: number, data: object}>} Response status and data.
 */
const UserIsAuthenticated = async () => {
    try {
        const response = await axios.post(`${apiURL}/api/user/isAuthenticated`);
        return { status: response.status, data: response.data };
    } catch (error) {
        console.error("Error in UserIsAuthenticated:", error.message);
        return { status: error.response?.status || 500, data: null };
    }
};

/******************************************************************************
 * Product-related Functions
 ******************************************************************************/

/**
 * Fetches all products from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and product data.
 */
const GetProducts = async () => {
    try {
        const response = await fetch(`${apiURL}/api/product`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Deletes a product by ID.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and result data.
 */
const DeleteProduct = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid product ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/product/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Failed to delete product. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error deleting product:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches product data by ID.
 * @param {string} id - The product ID.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and product data.
 */
const GetProductByID = async (id) => {
    if (!id || typeof id !== "string") {
        console.error("Invalid product ID provided.");
        return { status: 400, data: null };
    }
    try {
        const response = await fetch(`${apiURL}/api/product/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching product:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches product options from the API.
 * @returns {Promise<{status: number, data: string[] | null}>} Response status and product options.
 */
const GetProductOptions = async () => {
    try {
        const response = await fetch(`${apiURL}/api/product`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products. Status: ${response.status}`);
        }

        const json = await response.json();
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const productOptions = json
            .filter((product) => typeof product.productname === "string")
            .map((product) => product.productname);

        return { status: response.status, data: productOptions };
    } catch (error) {
        console.error("Error fetching product options:", error.message);
        return { status: null, data: null };
    }
};

/******************************************************************************
 * Project-related Functions
 ******************************************************************************/

/**
 * Fetches all projects from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and project data.
 */
const GetAllProjects = async () => {
    try {
        const response = await fetch(`${apiURL}/api/project`);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches projects filtered by status and customer.
 * @param {string} status - Project status to filter by.
 * @param {string} customer - Customer name to filter by.
 * @returns {Promise<{ status: number, data: object[] | null }>} - A promise resolving to status and filtered project data.
 */
const GetProjectsByStatus = async (status, customer) => {
    try {
        const response = await axios.get(`${apiURL}/api/project`);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }

        if (!Array.isArray(response.data)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const projects = response.data.filter(
            (project) => project.customer === customer && project.status === status,
        );

        return { status: 200, data: projects };
    } catch (error) {
        console.error("Error in GetProjectsByStatus:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches all projects for a specific customer.
 * @param {string} customer - Customer name to filter projects.
 * @returns {Promise<{status: number | null, data: object[] | null}>} Response status and filtered project data.
 */
const GetAllProjectsByCustomer = async (customerName) => {
    // const apiURL = "https://keen-squid-lately.ngrok-free.app";
    try {
        const response = await fetch(`${apiURL}/api/project/customer/${customerName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects. Status: ${response.status}`);
        }

        const projects = await response.json();
        
        return { status: response.status, data: projects };
    } catch (error) {
        console.error("Error in GetAllProjectsByCustomer:", error.message);
        return { status: null, data: null };
    }
};

/**
 * Delete a project by ID.
 * @param {string} id - Project ID.
 * @returns {Promise<object>} - API response or error object.
 */
const DeleteProject = async (id) => apiRequest(`/api/project/${id}`, "DELETE");

/**
 * Save a new project to the API.
 * @param {object} data - Project data to save.
 * @returns {Promise<object>} - API response or error object.
 */
const SaveProject = async (data) => apiRequest("/api/project/", "POST", data);

/**
 * Update project details.
 * @param {string} id - Project ID.
 * @param {object} body - Updated project data.
 * @returns {Promise<object>} - API response or error object.
 */
const UpdateProject = async (id, body) =>
    apiRequest(`/api/project/${id}`, "PATCH", body);

/**
 * Retrieves project ID using project name and customer name.
 * @param {string} projectName - The name of the project
 * @param {string} customer - The name of the customer
 * @returns {Promise<{status: number, data: {projectId: string, projectname: string, customer: string} | null, error: string | null}>}
 */
const GetProjectIDByNameAndCustomer = async (projectName, customer) => {
	const cleanCustomer = cleanUpStr(customer);
	try {
		if (!projectName || !customer) {
			throw new Error("Project name and customer are required");
		}

		const response = await axios.get(
			`${apiURL}/api/project/id-by-name-customer`,
			{
				params: {
					projectname: projectName,
					customer: cleanCustomer,
				},
			},
		);

		if (response.status === 200) {
			return {
				status: 200,
				data: response.data.data,
				error: null,
			};
		}

		throw new Error("Failed to retrieve project ID");
	} catch (error) {
		console.error("Error retrieving project ID:", error.message);
		return {
			status: error.response?.status || 500,
			data: null,
			error: error.message,
		};
	}
};

/******************************************************************************
 * Rig-related Functions
 ******************************************************************************/

/**
 * Fetches all rigs from the API.
 * @returns {Promise<{ status: number, data: object[] }>} - A promise resolving to status and rig data.
 */
const GetRigs = async () => {
    try {
        const response = await fetch(`${apiURL}/api/rig`);
        if (!response.ok) {
            throw new Error(`Failed to fetch rigs. Status: ${response.status}`);
        }
        const json = await response.json();
        return { status: response.status, data: json };
    } catch (error) {
        console.error("Error fetching rigs:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Fetches rigs filtered by rig company name.
 * @param {string} rigCompany - The name of the rig company to filter rigs.
 * @returns {Promise<{ status: number | null, data: object[] }>} - A promise resolving to status and filtered rig data.
 */
const GetRigsByRigCompany = async (rigCompany) => {
    try {
        if (!rigCompany) throw new Error("Rig company name is required.");

        const response = await fetch(`${apiURL}/api/rig`);
        if (!response.ok) {
            throw new Error(`Failed to fetch rigs. Status: ${response.status}`);
        }

        const json = await response.json();
        if (!Array.isArray(json)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        const rigs = json.filter((rig) => rig.rigcompanyname === rigCompany);
        return { status: response.status, data: rigs };
    } catch (error) {
        console.error("Error fetching rigs by company:", error.message);
        return { status: 500, data: [] };
    }
};

/**
 * Deletes a rig by ID.
 * @param {string} id - The ID of the rig to delete.
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and result data.
 */
const DeleteRig = async (id) => {
    try {
        if (!id) throw new Error("Rig ID is required.");

        const response = await fetch(`${apiURL}/api/rig/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Failed to delete rig. Status: ${response.status}`);
        }

        return { status: response.status, data: await response.json() };
    } catch (error) {
        console.error("Error deleting rig:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Fetches supplier products filtered by category and product.
 * @param {string} category - The product category.
 * @param {string} product - The product name.
 * @returns {Promise<{ status: number, data: object[] | null }>} - A promise resolving to status and supplier product data.
 */
const GetSupplierProductsByProduct = async (category, product) => {
    try {
        if (!category || !product) {
            throw new Error("Category and product are required.");
        }

        const response = await axios.get(
            `${apiURL}/api/supplierproductsview/byproduct`,
            {
                params: { category, product },
            },
        );

        if (response.status !== 200) {
            throw new Error(`Failed to fetch supplier products. Status: ${response.status}`);
        }

        if (!Array.isArray(response.data)) {
            throw new Error("Unexpected response format. Expected an array.");
        }

        return { status: 200, data: response.data };
    } catch (error) {
        console.error("Error fetching supplier products:", error.message);
        return { status: 500, data: null };
    }
};

/**
 * Creates a new request template.
 * @param {Object} templateData - The template data to create
 * @param {string} templateData.name - Template name (required, unique)
 * @param {string} templateData.description - Template description
 * @param {string} templateData.category - Request category (required)
 * @param {string} templateData.product - Product name (required)
 * @param {string} templateData.comment - Additional comments
 * @param {number} templateData.quantity - Request quantity (min: 1)
 * @param {('MSA'|'OPEN'|'SSR')} templateData.preferredVendorType - Vendor type
 * @param {string} templateData.preferredVendor - Preferred vendor name
 * @param {string} templateData.createdBy - User ID who created the template
 * @returns {Promise<{status: number, data: Object|null, error: string|null}>}
 */
const createRequestTemplate = async (templateData) => {
	try {
		// Validate required fields
		const requiredFields = [
			"name",
			"category",
			"product",
			"preferredVendorType",
			"createdBy",
		];
		const missingFields = requiredFields.filter(
			(field) => !templateData[field],
		);

		if (missingFields.length > 0) {
			throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
		}

		// Validate vendor type
		const validVendorTypes = ["MSA", "OPEN", "SSR"];
		if (!validVendorTypes.includes(templateData.preferredVendorType)) {
			throw new Error("Invalid preferredVendorType. Must be MSA, OPEN, or SSR");
		}

		// Validate quantity
		if (
			templateData.quantity &&
			(templateData.quantity < 1 || !Number.isInteger(templateData.quantity))
		) {
			throw new Error("Quantity must be a positive integer");
		}

		// Validate SSR vendor
		if (
			templateData.preferredVendorType === "SSR" &&
			!templateData.preferredVendor
		) {
			throw new Error("Preferred vendor is required for SSR type");
		}

		const response = await axios.post(`${apiURL}/api/requesttemplate`, templateData);
		return {
			status: response.status,
			data: response.data,
			error: null,
		};
	} catch (error) {
		console.error("Error creating template:", error.message);
		return {
			status: error.response?.status || 500,
			data: null,
			error: error.message,
		};
	}
};

/**
 * Fetches all templates for a specific user.
 * @param {string} userId - The ID of the user whose templates to fetch
 * @returns {Promise<{status: number, data: Array<Object>|null, error: string|null}>}
 */
const getRequestTemplates = async (userId) => {
	try {
		if (!userId || typeof userId !== "string") {
			throw new Error("Valid userId is required");
		}

		const response = await axios.get(`${apiURL}/api/requesttemplate`, {
			params: { createdBy: userId },
		});

		return {
			status: response.status,
			data: response.data.data,
			error: null,
		};
	} catch (error) {
		console.error("Error fetching templates:", error.message);
		return {
			status: error.response?.status || 500,
			data: null,
			error: error.message,
		};
	}
};

/**
 * Updates an existing request template.
 * @param {string} templateId - The ID of the template to update
 * @param {Object} updateData - The template data to update
 * @returns {Promise<{status: number, data: Object|null, error: string|null}>}
 */
const updateRequestTemplate = async (templateId, updateData) => {
	try {
		if (!templateId || typeof templateId !== "string") {
			throw new Error("Valid templateId is required");
		}

		// Validate vendor type if it's being updated
		if (updateData.preferredVendorType) {
			const validVendorTypes = ["MSA", "OPEN", "SSR"];
			if (!validVendorTypes.includes(updateData.preferredVendorType)) {
				throw new Error(
					"Invalid preferredVendorType. Must be MSA, OPEN, or SSR",
				);
			}

			// Validate SSR vendor
			if (
				updateData.preferredVendorType === "SSR" &&
				!updateData.preferredVendor
			) {
				throw new Error("Preferred vendor is required for SSR type");
			}
		}

		// Validate quantity if it's being updated
		if (updateData.quantity !== undefined) {
			if (updateData.quantity < 1 || !Number.isInteger(updateData.quantity)) {
				throw new Error("Quantity must be a positive integer");
			}
		}

		const response = await axios.put(
			`${apiURL}/api/requesttemplate/${templateId}`,
			updateData,
		);
		return {
			status: response.status,
			data: response.data.data,
			error: null,
		};
	} catch (error) {
		console.error("Error updating template:", error.message);
		return {
			status: error.response?.status || 500,
			data: null,
			error: error.message,
		};
	}
};

/**
 * Deletes a request template.
 * @param {string} templateId - The ID of the template to delete
 * @returns {Promise<{status: number, error: string|null}>}
 */
const deleteRequestTemplate = async (templateId) => {
	try {
		if (!templateId || typeof templateId !== "string") {
			throw new Error("Valid templateId is required");
		}

		const response = await axios.delete(
			`${apiURL}/api/requesttemplate/${templateId}`,
		);
		return {
			status: response.status,
			error: null,
		};
	} catch (error) {
		console.error("Error deleting template:", error.message);
		return {
			status: error.response?.status || 500,
			error: error.message,
		};
	}
};

/**
 * Retrieves all supplier group data.
 *
 * @returns {Promise<{ status: number, data: object | null }>} - A promise resolving to status and supplier group data.
 */
const GetAllSupplierGroupData = async () => {
	try {
		const response = await fetch(`${apiURL}/api/suppliergroup`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch supplier group data with status: ${response.status}`,
			);
		}

		const json = await response.json();
		return { status: response.status, data: json };
	} catch (error) {
		console.error("Error fetching supplier group data:", error.message);
		return { status: 500, data: null };
	}
};

const UpdateRequestBidListUsers = async (reqID, bidListUsers) => {
    const strAPI = `${apiURL}/api/request/${reqID}/bid-list-users`;
    const body = bidListUsers;
    try {
        const response = await axios.patch(strAPI, body);
        if (response.status === 200) {
            return { status: 200, data: response.data };
        }
        return { status: 400 };
    } catch (error) {
        return { status: 500 };
    }
};

const UpdateRequestBidListCompanies = async (reqID, bidList) => {
    const strAPI = `${apiURL}/api/request/${reqID}/bid-list-companies`;
    const body = bidList;
    try {
        const response = await axios.patch(strAPI, body);
        if (response.status === 200) {
            return { status: 200, data: response.data };
        }
        return { status: 400 };
    } catch (error) {
        return { status: 500 };
    }
};

const GetRequestBidListCompanies = async (bidListUsers) => {
	const strAPI = `${apiURL}/api/contact/companies-by-emails`;
	const body = { bidListUsers };
	console.log(`StrAPI: ${strAPI}`);
	console.log(`Body: ${JSON.stringify(body)}`);
	try {
		const response = await axios.post(strAPI, body);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.error("Error getting bid list companies:", error);
		return { status: error.response?.status || 500, data: null };
	}
};

/**
 * Retrieves vendor ID using vendor name.
 * @param {string} vendorName - The name of the vendor
 * @returns {Promise<{status: number, data: {vendorId: string, name: string} | null, error: string | null}>}
 */
const GetVendorIDByName = async (vendorName) => {
	try {
		if (!vendorName) {
			throw new Error("Vendor name is required");
		}

		const response = await axios.get(`${apiURL}/api/firm/id-by-name`, {
			params: {
				name: vendorName,
			},
		});

		if (response.status === 200) {
			return {
				status: 200,
				data: response.data.data,
				error: null,
			};
		}

		throw new Error("Failed to retrieve vendor ID");
	} catch (error) {
		console.error("Error retrieving vendor ID:", error.message);
		return {
			status: error.response?.status || 500,
			data: null,
			error: error.message,
		};
	}
};

/**
 * Fetch delivery assignments with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.deliveryAssociateId - Filter by delivery associate ID
 * @param {string} filters.supplierId - Filter by supplier ID
 * @param {string} filters.requestId - Filter by request ID
 * @param {string} filters.startDate - Filter by start date (YYYY-MM-DD)
 * @param {string} filters.endDate - Filter by end date (YYYY-MM-DD)
 * @param {string} filters.category - Filter by request category
 * @param {string} filters.status - Filter by assignment status
 * @returns {Promise<Array>} Array of delivery assignments
 */
const fetchDeliveryAssignments = async (filters = {}) => {
	const queryParams = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value) {
			queryParams.append(key, value);
		}
	}

	return fetchWithHandling(
		`/api/delivery-assignments?${queryParams.toString()}`,
	);
};

/**
 * Create a new delivery assignment
 * @param {Object} assignment - Assignment details
 * @returns {Promise<Object>} Created assignment
 */
const createDeliveryAssignment = async (assignment) => {
	return apiRequest("/api/delivery-assignments", "POST", assignment);
};

/**
 * Update an existing delivery assignment
 * @param {string} id - Assignment ID
 * @param {Object} updates - Updated assignment details
 * @returns {Promise<Object>} Updated assignment
 */
const updateDeliveryAssignment = async (id, updates) => {
	return apiRequest(`/api/delivery-assignments/${id}`, "PUT", updates);
};

/**
 * Delete a delivery assignment
 * @param {string} id - Assignment ID
 * @returns {Promise<void>}
 */
const deleteDeliveryAssignment = async (id) => {
	return apiRequest(`/api/delivery-assignments/${id}`, "DELETE");
};

/**
 * Get delivery associate workload for a specific date
 * @param {string} deliveryAssociateId - Delivery associate ID
 * @param {string} date - Date to check workload (YYYY-MM-DD)
 * @returns {Promise<Object>} Workload information
 */
const getDeliveryAssociateWorkload = async (deliveryAssociateId, date) => {
	return fetchWithHandling(
		`/api/delivery-assignments/workload?deliveryAssociateId=${deliveryAssociateId}&date=${date}`,
	);
};

// Export all functions
/**
 * API functions exported from worksideAPI.jsx
 *
 * @module worksideAPI
 * @exports fetchWithHandling - Handles API requests with error handling.
 * @exports GetAllFirms - Retrieves all firms.
 * @exports GetAllFirmsForSelection - Retrieves all firms for selection dropdowns.
 * @exports GetAllSuppliers - Retrieves all suppliers.
 * @exports GetAllRigCompanies - Retrieves all rig companies.
 * @exports GetAllCustomers - Retrieves all customers.
 * @exports GetAllContacts - Retrieves all contacts.
 * @exports GetContactIDByEmail - Retrieves a contact ID by email.
 * @exports GetContactsByFirm - Retrieves contacts associated with a specific firm.
 * @exports GetFirmOptions - Retrieves firm options for dropdowns.
 * @exports GetCustomerOptions - Retrieves customer options for dropdowns.
 * @exports GetSupplierOptions - Retrieves supplier options for dropdowns.
 * @exports GetContactOptions - Retrieves contact options for dropdowns.
 * @exports GetFirmID - Retrieves a firm's ID.
 * @exports GetFirmType - Retrieves a firm's type.
 * @exports GetContactID - Retrieves a contact's ID.
 * @exports GetCustomerSupplierMSAData - Retrieves MSA data for customers and suppliers.
 * @exports GetSupplierGroupData - Retrieves supplier group data.
 * @exports GetAllRequests - Retrieves all requests.
 * @exports GetAllRequestsByProject - Retrieves all requests for a specific project.
 * @exports SaveNewRequest - Saves a new request.
 * @exports UpdateRequest - Updates an existing request.
 * @exports SaveRequestBid - Saves a new request bid.
 * @exports UpdateRequestBid - Updates an existing request bid.
 * @exports DoesRequestBidExist - Checks if a request bid exists.
 * @exports GetRequestBids - Retrieves request bids.
 * @exports UpdateRequestStatus - Updates the status of a request.
 * @exports SetRequestBidsStatus - Sets the status of request bids.
 * @exports SetAwardedRequestBidStatus - Sets the status of an awarded request bid.
 * @exports GetDeliveryAssociates - Retrieves delivery associates.
 * @exports GetSupplierInfoFromID - Retrieves supplier information by ID.
 * @exports GetSupplierIDFromName - Retrieves a supplier ID by name.
 * @exports GetRequestsByCustomer - Retrieves requests associated with a specific customer.
 * @exports GetRequestData - Retrieves data for a specific request.
 * @exports GetRequestOptions - Retrieves request options for dropdowns.
 * @exports GetRequestID - Retrieves a request's ID.
 * @exports GetRequestCategoryOptions - Retrieves request category options for dropdowns.
 * @exports GetRequestCategoryID - Retrieves a request category's ID.
 * @exports GetRequestStatusOptions - Retrieves request status options for dropdowns.
 * @exports GetAllUsers - Retrieves all users.
 * @exports UserForgotPassword - Handles user password recovery.
 * @exports UserDoesExist - Checks if a user exists.
 * @exports UserResetPassword - Resets a user's password.
 * @exports UserChangePassword - Changes a user's password.
 * @exports UserLogin - Logs in a user.
 * @exports UserRegister - Registers a new user.
 * @exports UserLogout - Logs out a user.
 * @exports UserIsAuthenticated - Checks if a user is authenticated.
 * @exports GetProducts - Retrieves all products.
 * @exports DeleteProduct - Deletes a product.
 * @exports GetProductByID - Retrieves a product by ID.
 * @exports GetProductOptions - Retrieves product options for dropdowns.
 * @exports GetAllProjects - Retrieves all projects.
 * @exports GetProjectsByStatus - Retrieves projects filtered by status.
 * @exports GetAllProjectsByCustomer - Retrieves all projects associated with a specific customer.
 * @exports DeleteProject - Deletes a project.
 * @exports SaveProject - Saves a new project.
 * @exports UpdateProject - Updates an existing project.
 * @exports GetRigs - Retrieves all rigs.
 * @exports GetRigsByRigCompany - Retrieves rigs associated with a specific rig company.
 * @exports DeleteRig - Deletes a rig.
 * @exports GetSupplierProductsByProduct - Retrieves supplier products by product.
 * @exports createRequestTemplate - Creates a new request template.
 * @exports getRequestTemplates - Retrieves all request templates.
 * @exports updateRequestTemplate - Updates an existing request template.
 * @exports deleteRequestTemplate - Deletes a request template.
 * @exports GetAllSupplierGroupData - Retrieves all supplier group data.
 * @exports UpdateRequestBidListUsers - Updates the user list for a request bid.
 * @exports UpdateRequestBidListCompanies - Updates the company list for a request bid.
 * @exports GetRequestBidListCompanies - Retrieves the company list for a request bid.
 * @exports GetProjectIDByNameAndCustomer - Retrieves a project ID by name and customer.
 * @exports GetVendorIDByName - Retrieves a vendor ID by name.
 * @exports fetchDeliveryAssignments - Retrieves delivery assignments with optional filters
 * @exports createDeliveryAssignment - Creates a new delivery assignment
 * @exports updateDeliveryAssignment - Updates an existing delivery assignment
 * @exports deleteDeliveryAssignment - Deletes a delivery assignment
 * @exports getDeliveryAssociateWorkload - Retrieves delivery associate workload for a specific date
 */
export {
	fetchWithHandling,
	GetAllFirms,
	GetAllFirmsForSelection,
	GetAllSuppliers,
	GetAllRigCompanies,
	GetAllCustomers,
	GetAllContacts,
	GetContactIDByEmail,
	GetContactsByFirm,
	GetFirmOptions,
	GetCustomerOptions,
	GetSupplierOptions,
	GetContactOptions,
	GetFirmID,
	GetFirmType,
	GetContactID,
	GetCustomerSupplierMSAData,
	GetSupplierGroupData,
	GetAllRequests,
	GetAllRequestsByProject,
	SaveNewRequest,
	UpdateRequest,
	SaveRequestBid,
	UpdateRequestBid,
	DoesRequestBidExist,
	GetRequestBids,
	UpdateRequestStatus,
	SetRequestBidsStatus,
	SetAwardedRequestBidStatus,
	GetDeliveryAssociates,
	GetSupplierInfoFromID,
	GetSupplierIDFromName,
	GetRequestsByCustomer,
	GetRequestData,
	GetRequestOptions,
	GetRequestID,
	GetRequestCategoryOptions,
	GetRequestCategoryID,
	GetRequestStatusOptions,
	GetAllUsers,
	UserForgotPassword,
	UserDoesExist,
	UserResetPassword,
	UserChangePassword,
	UserLogin,
	UserRegister,
	UserLogout,
	UserIsAuthenticated,
	GetProducts,
	DeleteProduct,
	GetProductByID,
	GetProductOptions,
	GetAllProjects,
	GetProjectsByStatus,
	GetAllProjectsByCustomer,
	DeleteProject,
	SaveProject,
	UpdateProject,
	GetRigs,
	GetRigsByRigCompany,
	DeleteRig,
	GetSupplierProductsByProduct,
	createRequestTemplate,
	getRequestTemplates,
	updateRequestTemplate,
	deleteRequestTemplate,
	GetAllSupplierGroupData,
	UpdateRequestBidListUsers,
	UpdateRequestBidListCompanies,
	GetRequestBidListCompanies,
	GetProjectIDByNameAndCustomer,
	GetVendorIDByName,
	fetchDeliveryAssignments,
	createDeliveryAssignment,
	updateDeliveryAssignment,
	deleteDeliveryAssignment,
	getDeliveryAssociateWorkload,
};
