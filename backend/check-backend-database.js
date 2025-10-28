const mongoose = require('mongoose');

// Check what database the backend is connecting to
async function checkBackendDatabase() {
    try {
        console.log('🔍 [DATABASE] Checking backend database connection...');
        console.log('🔍 [DATABASE] MONGO_URI:', process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ [DATABASE] Connected successfully');
        
        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log('📊 [DATABASE] Database name:', dbName);
        
        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 [DATABASE] Collections:', collections.map(c => c.name));
        
        // Check projects count
        const Project = require('./models/projectModel');
        const projectCount = await Project.countDocuments();
        console.log('📊 [DATABASE] Projects count:', projectCount);
        
        // Check requests count
        const Request = require('./models/requestModel');
        const requestCount = await Request.countDocuments();
        console.log('📊 [DATABASE] Requests count:', requestCount);
        
        // Check specific project
        const specificProject = await Project.findById('67998cfb9acbee0bb711d883');
        if (specificProject) {
            console.log('✅ [DATABASE] Found specific project:', specificProject.projectname);
        } else {
            console.log('❌ [DATABASE] Specific project NOT found in this database');
        }
        
        // Check requests for that project
        const requestsForProject = await Request.find({ project_id: '67998cfb9acbee0bb711d883' });
        console.log('📊 [DATABASE] Requests for specific project:', requestsForProject.length);
        
        if (requestsForProject.length > 0) {
            console.log('📋 [DATABASE] Request details:');
            requestsForProject.forEach((req, index) => {
                console.log(`  ${index + 1}. ${req.description || 'No description'} - Status: ${req.status}`);
            });
        }
        
    } catch (error) {
        console.error('❌ [DATABASE] Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkBackendDatabase();
