require('dotenv').config();
const mongoose = require('mongoose');
const Request = require('./models/requestModel');

async function fixTenantId() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');
        
        const chevronFirmId = '65423d5c240388c1594e7b79';
        console.log('✅ Using Chevron firmId:', chevronFirmId);
        
        const updateResult = await Request.updateMany(
            { tenantId: { $exists: false } },
            { $set: { tenantId: new mongoose.Types.ObjectId(chevronFirmId) } }
        );
        
        console.log('✅ Updated', updateResult.modifiedCount, 'requests with tenantId');
        
        const testRequests = await Request.find({ 
            project_id: '67998cfb9acbee0bb711d883',
            tenantId: new mongoose.Types.ObjectId(chevronFirmId)
        });
        
        console.log('✅ Test project requests with tenantId:', testRequests.length);
        mongoose.disconnect();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixTenantId();
