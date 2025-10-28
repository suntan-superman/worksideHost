const mongoose = require('mongoose');
const { User } = require('./models/userModel');
const Request = require('./models/requestModel');
const Project = require('./models/projectModel');

async function fixRequestTenantId() {
    try {
        console.log('🔧 [FIX] Starting tenantId fix for requests...');
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ [FIX] Connected to database');
        
        // Get all requests without tenantId
        const requestsWithoutTenantId = await Request.find({ tenantId: { $exists: false } });
        console.log('📊 [FIX] Found', requestsWithoutTenantId.length, 'requests without tenantId');
        
        if (requestsWithoutTenantId.length === 0) {
            console.log('✅ [FIX] All requests already have tenantId');
            return;
        }
        
        // Get Chevron user for tenantId
        const chevronUser = await User.findOne({ email: 'worksidedemo+chevron@gmail.com' }).populate('firmId');
        if (!chevronUser) {
            console.log('❌ [FIX] Chevron user not found');
            return;
        }
        
        console.log('✅ [FIX] Found Chevron user with firmId:', chevronUser.firmId._id);
        
        // Update all requests to have the Chevron tenantId
        const updateResult = await Request.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: chevronUser.firmId._id } }
        );
        
        console.log('✅ [FIX] Updated', updateResult.modifiedCount, 'requests with tenantId');
        
        // Verify the fix
        const requestsWithTenantId = await Request.find({ tenantId: chevronUser.firmId._id });
        console.log('📊 [FIX] Requests with Chevron tenantId:', requestsWithTenantId.length);
        
        // Test the specific project
        const testRequests = await Request.find({ 
            project_id: '67998cfb9acbee0bb711d883',
            tenantId: chevronUser.firmId._id 
        });
        console.log('📊 [FIX] Test project requests with tenantId:', testRequests.length);
        
        console.log('🎉 [FIX] TenantId fix completed successfully!');
        
    } catch (error) {
        console.error('❌ [FIX] Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

fixRequestTenantId();
