const axios = require('axios');

// Configuration - Try different server URLs
const POSSIBLE_URLS = [
    'http://localhost:4000',
    'http://127.0.0.1:4000', 
    'http://192.168.1.200:4000',
    'http://localhost:8080',
    'http://localhost:3000'
];

const TEST_EMAIL = 'worksidedemo+chevron@gmail.com';
const TEST_PASSWORD = 'Pinnacle55';

// Test script to debug requests by project
async function testRequestsByProject() {
    let API_BASE_URL = null;
    
    // First, try to find the correct server URL
    console.log('🔍 [TEST] Finding the correct server URL...');
    
    for (const url of POSSIBLE_URLS) {
        try {
            console.log(`🔍 [TEST] Trying ${url}...`);
            const healthResponse = await axios.get(`${url}/api/health`, { timeout: 2000 });
            if (healthResponse.status === 200) {
                API_BASE_URL = url;
                console.log(`✅ [TEST] Found server at ${url}`);
                break;
            }
        } catch (error) {
            console.log(`❌ [TEST] ${url} not responding: ${error.message}`);
        }
    }
    
    if (!API_BASE_URL) {
        console.log('❌ [TEST] Could not find the server. Please check:');
        console.log('   - Is the backend server running?');
        console.log('   - What port is it running on?');
        console.log('   - Is it accessible from this machine?');
        return;
    }
    
    try {
        console.log('🔍 [TEST] Starting requests by project test...');
        console.log('🔍 [TEST] Using API URL:', API_BASE_URL);
        
        // Step 1: Login to get authentication token
        console.log('\n📝 [STEP 1] Logging in to get authentication token...');
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        
        if (loginResponse.status !== 200) {
            throw new Error(`Login failed with status: ${loginResponse.status}`);
        }
        
        const { token, user } = loginResponse.data.data;
        console.log('✅ [LOGIN] Successfully logged in');
        console.log('✅ [LOGIN] User:', user.firstName, user.lastName);
        console.log('✅ [LOGIN] Company:', user.company);
        console.log('✅ [LOGIN] Firm:', user.firm.name);
        console.log('✅ [LOGIN] Token preview:', token.substring(0, 20) + '...');
        
        // Step 2: Get all projects for the user
        console.log('\n📝 [STEP 2] Fetching projects...');
        const projectsResponse = await axios.get(`${API_BASE_URL}/api/project`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (projectsResponse.status !== 200) {
            throw new Error(`Projects fetch failed with status: ${projectsResponse.status}`);
        }
        
        const projects = projectsResponse.data;
        console.log('✅ [PROJECTS] Found', projects.length, 'projects');
        
        if (projects.length === 0) {
            console.log('❌ [PROJECTS] No projects found - cannot test requests');
            return;
        }
        
        // Display projects
        console.log('\n📋 [PROJECTS] Available projects:');
        projects.forEach((project, index) => {
            console.log(`  ${index + 1}. ${project.projectname} (${project.customer}) - ID: ${project._id}`);
        });
        
        // Step 3: Test requests for each project
        console.log('\n📝 [STEP 3] Testing requests for each project...');
        
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            console.log(`\n🔍 [PROJECT ${i + 1}] Testing: ${project.projectname}`);
            console.log(`🔍 [PROJECT ${i + 1}] Project ID: ${project._id}`);
            console.log(`🔍 [PROJECT ${i + 1}] Customer: ${project.customer}`);
            
            try {
                const requestsResponse = await axios.get(`${API_BASE_URL}/api/request/byprojectid/${project._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (requestsResponse.status === 200) {
                    const requests = requestsResponse.data.data || requestsResponse.data;
                    console.log(`✅ [REQUESTS] Found ${requests.length} requests for project ${project.projectname}`);
                    
                    if (requests.length > 0) {
                        console.log('📋 [REQUESTS] Request details:');
                        requests.forEach((request, reqIndex) => {
                            console.log(`  ${reqIndex + 1}. ${request.description || 'No description'} - Status: ${request.status || 'Unknown'}`);
                        });
                    } else {
                        console.log('⚠️ [REQUESTS] No requests found for this project');
                    }
                } else {
                    console.log(`❌ [REQUESTS] Failed to fetch requests - Status: ${requestsResponse.status}`);
                    console.log(`❌ [REQUESTS] Response:`, requestsResponse.data);
                }
            } catch (error) {
                console.log(`❌ [REQUESTS] Error fetching requests for project ${project.projectname}:`);
                console.log(`❌ [REQUESTS] Error message:`, error.message);
                if (error.response) {
                    console.log(`❌ [REQUESTS] Response status:`, error.response.status);
                    console.log(`❌ [REQUESTS] Response data:`, error.response.data);
                }
            }
        }
        
        // Step 4: Test direct requests endpoint
        console.log('\n📝 [STEP 4] Testing direct requests endpoint...');
        try {
            const allRequestsResponse = await axios.get(`${API_BASE_URL}/api/request`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (allRequestsResponse.status === 200) {
                const allRequests = allRequestsResponse.data.data || allRequestsResponse.data;
                console.log('✅ [ALL REQUESTS] Found', allRequests.length, 'total requests');
                
                if (allRequests.length > 0) {
                    console.log('📋 [ALL REQUESTS] Request details:');
                    allRequests.forEach((request, index) => {
                        console.log(`  ${index + 1}. ${request.description || 'No description'} - Project: ${request.project_id || 'No project'} - Status: ${request.status || 'Unknown'}`);
                    });
                }
            } else {
                console.log(`❌ [ALL REQUESTS] Failed to fetch all requests - Status: ${allRequestsResponse.status}`);
                console.log(`❌ [ALL REQUESTS] Response:`, allRequestsResponse.data);
            }
        } catch (error) {
            console.log(`❌ [ALL REQUESTS] Error fetching all requests:`);
            console.log(`❌ [ALL REQUESTS] Error message:`, error.message);
            if (error.response) {
                console.log(`❌ [ALL REQUESTS] Response status:`, error.response.status);
                console.log(`❌ [ALL REQUESTS] Response data:`, error.response.data);
            }
        }
        
        console.log('\n🎉 [TEST] Requests by project test completed!');
        
    } catch (error) {
        console.error('❌ [TEST] Test failed:');
        console.error('❌ [TEST] Error message:', error.message);
        if (error.response) {
            console.error('❌ [TEST] Response status:', error.response.status);
            console.error('❌ [TEST] Response data:', error.response.data);
        }
        console.error('❌ [TEST] Stack trace:', error.stack);
    }
}

// Run the test
testRequestsByProject();
