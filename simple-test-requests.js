const axios = require('axios');

// Simple test for requests by project
async function testRequests() {
    try {
        console.log('🔍 [TEST] Testing requests by project...');
        
        // Step 1: Login
        console.log('\n📝 [STEP 1] Logging in...');
        const loginResponse = await axios.post('http://localhost:4000/api/auth', {
            email: 'worksidedemo+chevron@gmail.com',
            password: 'Pinnacle55'
        });
        
        console.log('✅ [LOGIN] Success!');
        console.log('✅ [LOGIN] User:', loginResponse.data.data.user.firstName, loginResponse.data.data.user.lastName);
        console.log('✅ [LOGIN] Company:', loginResponse.data.data.user.company);
        console.log('✅ [LOGIN] Firm:', loginResponse.data.data.user.firm.name);
        
        const token = loginResponse.data.data.token;
        
        // Step 2: Get projects
        console.log('\n📝 [STEP 2] Getting projects...');
        const projectsResponse = await axios.get('http://localhost:4000/api/project', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const projects = projectsResponse.data;
        console.log('✅ [PROJECTS] Found', projects.length, 'projects');
        
        if (projects.length === 0) {
            console.log('❌ [PROJECTS] No projects found!');
            return;
        }
        
        // Show first project
        const firstProject = projects[0];
        console.log('📋 [PROJECT] First project:', firstProject.projectname);
        console.log('📋 [PROJECT] Project ID:', firstProject._id);
        
        // Step 3: Test requests for first project
        console.log('\n📝 [STEP 3] Testing requests for first project...');
        const requestsResponse = await axios.get(`http://localhost:4000/api/request/byprojectid/${firstProject._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ [REQUESTS] Response status:', requestsResponse.status);
        console.log('✅ [REQUESTS] Response data:', JSON.stringify(requestsResponse.data, null, 2));
        
        // Step 4: Test all requests
        console.log('\n📝 [STEP 4] Testing all requests...');
        const allRequestsResponse = await axios.get('http://localhost:4000/api/request', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('✅ [ALL REQUESTS] Response status:', allRequestsResponse.status);
        console.log('✅ [ALL REQUESTS] Response data:', JSON.stringify(allRequestsResponse.data, null, 2));
        
    } catch (error) {
        console.error('❌ [ERROR] Test failed:');
        console.error('❌ [ERROR] Message:', error.message);
        if (error.response) {
            console.error('❌ [ERROR] Status:', error.response.status);
            console.error('❌ [ERROR] Data:', error.response.data);
        }
    }
}

testRequests();
