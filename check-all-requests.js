const mongoose = require('mongoose');
const Request = require('./models/requestModel');
const { User } = require('./models/userModel');
const Firm = require('./models/firmModel');

// Check all requests in the database
async function checkAllRequests() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');
        
        // Get total count of requests
        const totalRequests = await Request.countDocuments();
        console.log('📊 Total requests in database:', totalRequests);
        
        if (totalRequests === 0) {
            console.log('❌ No requests found in the entire database');
            return;
        }
        
        // Get all requests with tenant info
        const requests = await Request.find({}).populate('tenantId');
        console.log('📋 All requests:');
        
        requests.forEach((request, index) => {
            console.log(`  ${index + 1}. ${request.description || 'No description'}`);
            console.log(`     Project ID: ${request.project_id}`);
            console.log(`     Customer: ${request.customer}`);
            console.log(`     Status: ${request.status}`);
            console.log(`     Tenant: ${request.tenantId ? request.tenantId.name : 'NO TENANT'}`);
            console.log(`     Created: ${request.datetimerequested}`);
            console.log('');
        });
        
        // Check by tenant
        console.log('📊 Requests by tenant:');
        const requestsByTenant = await Request.aggregate([
            {
                $group: {
                    _id: '$tenantId',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        for (const group of requestsByTenant) {
            if (group._id) {
                const firm = await Firm.findById(group._id);
                console.log(`  ${firm ? firm.name : 'Unknown Firm'}: ${group.count} requests`);
            } else {
                console.log(`  No Tenant: ${group.count} requests`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkAllRequests();
