import axios from 'axios';

// Use environment variable for API URL - force local development
const apiURL = "http://192.168.1.200:4000";

// Enhanced fetch function with graceful error handling
const fetchWithHandling = async (endpoint, options = {}) => {
    try {
        console.log('📱 [FETCH] ===========================================');  
        console.log('📱 [FETCH] Starting API request...');
        console.log('📱 [FETCH] Endpoint:', endpoint);
        console.log('📱 [FETCH] Full URL:', `${apiURL}${endpoint}`);

        // Get authentication token from AsyncStorage
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;                                                                      
        const token = await AsyncStorage.getItem('auth_token');

        console.log('📱 [FETCH] Token from storage:', token ? 'FOUND' : 'NOT FOUND');                                                                           
        if (token) {
            console.log('📱 [FETCH] Token preview:', token.substring(0, 20) + '...');                                                                           
        }

        // Add authentication headers if token exists
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${apiURL}${endpoint}`, {
            ...options,
            headers,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        // GRACEFUL ERROR HANDLING - No more scary error messages
        console.log('📱 [FETCH] ===========================================');
        console.log('📱 [FETCH] ⚠️ Network request failed - handling gracefully');
        console.log('📱 [FETCH] Error type:', error.name);
        console.log('📱 [FETCH] ===========================================');
        
        // Return appropriate error response based on error type
        if (error.name === 'TypeError' && error.message === 'Network request failed') {
            return { 
                status: 503, 
                data: [], 
                error: 'Network unavailable. Please check your connection.',
                isNetworkError: true 
            };
        }
        
        return { 
            status: 500, 
            data: [], 
            error: 'Request failed. Please try again.',
            isNetworkError: false 
        };
    }
};

// Get All Projects with authentication
const GetAllProjects = async () => {
    try {
        console.log('🌐 [WEB API] Fetching projects with authentication...');
        const result = await fetchWithHandling('/api/project');
        console.log('🌐 [WEB API] Projects response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching projects:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Projects by Customer with authentication
const GetAllProjectsByCustomer = async (customerName) => {
    try {
        console.log('🌐 [WEB API] Fetching projects for customer:', customerName);
        const result = await fetchWithHandling(`/api/project/customer/${customerName}`);
        console.log('🌐 [WEB API] Projects by customer response:', result);
        return result;
    } catch (error) {
        console.error("Error in GetAllProjectsByCustomer:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Requests with authentication
const GetAllRequests = async () => {
    try {
        console.log('🌐 [WEB API] Fetching requests with authentication...');
        const result = await fetchWithHandling('/api/request');
        console.log('🌐 [WEB API] Requests response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching requests:", error.message);
        return { status: 500, data: [] };
    }
};

// Get Requests by Project with authentication
const GetRequestsByProject = async (projectId) => {
    try {
        console.log('🌐 [WEB API] Fetching requests for project:', projectId);
        const result = await fetchWithHandling(`/api/request/byprojectid/${projectId}`);
        console.log('🌐 [WEB API] Requests by project response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching requests by project:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Request Bids with authentication
const GetAllRequestBids = async () => {
    try {
        console.log('🌐 [WEB API] Fetching request bids with authentication...');
        const result = await fetchWithHandling('/api/requestbid');
        console.log('🌐 [WEB API] Request bids response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching request bids:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Firms with authentication
const GetAllFirms = async () => {
    try {
        console.log('🌐 [WEB API] Fetching firms with authentication...');
        const result = await fetchWithHandling('/api/firm');
        console.log('🌐 [WEB API] Firms response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching firms:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Contacts with authentication
const GetAllContacts = async () => {
    try {
        console.log('🌐 [WEB API] Fetching contacts with authentication...');
        const result = await fetchWithHandling('/api/contact');
        console.log('🌐 [WEB API] Contacts response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching contacts:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Users with authentication
const GetAllUsers = async () => {
    try {
        console.log('🌐 [WEB API] Fetching users with authentication...');
        const result = await fetchWithHandling('/api/user');
        console.log('🌐 [WEB API] Users response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Products with authentication
const GetAllProducts = async () => {
    try {
        console.log('🌐 [WEB API] Fetching products with authentication...');
        const result = await fetchWithHandling('/api/product');
        console.log('🌐 [WEB API] Products response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Supplier Products with authentication
const GetAllSupplierProducts = async () => {
    try {
        console.log('🌐 [WEB API] Fetching supplier products with authentication...');
        const result = await fetchWithHandling('/api/supplierproduct');
        console.log('🌐 [WEB API] Supplier products response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching supplier products:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Rigs with authentication
const GetAllRigs = async () => {
    try {
        console.log('🌐 [WEB API] Fetching rigs with authentication...');
        const result = await fetchWithHandling('/api/rig');
        console.log('🌐 [WEB API] Rigs response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching rigs:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Rig Companies with authentication
const GetAllRigCompanies = async () => {
    try {
        console.log('🌐 [WEB API] Fetching rig companies with authentication...');
        const result = await fetchWithHandling('/api/rigcompany');
        console.log('🌐 [WEB API] Rig companies response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching rig companies:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Suppliers with authentication
const GetAllSuppliers = async () => {
    try {
        console.log('🌐 [WEB API] Fetching suppliers with authentication...');
        const result = await fetchWithHandling('/api/supplier');
        console.log('🌐 [WEB API] Suppliers response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching suppliers:", error.message);
        return { status: 500, data: [] };
    }
};

// Get All Customers with authentication
const GetAllCustomers = async () => {
    try {
        console.log('🌐 [WEB API] Fetching customers with authentication...');
        const result = await fetchWithHandling('/api/customer');
        console.log('🌐 [WEB API] Customers response:', result);
        return result;
    } catch (error) {
        console.error("Error fetching customers:", error.message);
        return { status: 500, data: [] };
    }
};

// Export all functions
export {
    GetAllProjects,
    GetAllProjectsByCustomer,
    GetAllRequests,
    GetRequestsByProject,
    GetAllRequestBids,
    GetAllFirms,
    GetAllContacts,
    GetAllUsers,
    GetAllProducts,
    GetAllSupplierProducts,
    GetAllRigs,
    GetAllRigCompanies,
    GetAllSuppliers,
    GetAllCustomers,
    fetchWithHandling
};

