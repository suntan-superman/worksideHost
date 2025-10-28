const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sroy:l8dUBdRiajc8CYkG@cluster0.btnh8k6.mongodb.net/client");
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const fixCustomerNames = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        const tenantId = '65423d5c240388c1594e7b79';
        
        console.log('🔧 Fixing customer names for tenant:', tenantId);
        
        // Check current customer names
        const projects = await Project.find({ tenantId: tenantId }, { customer: 1, projectname: 1 });
        console.log(`📊 Found ${projects.length} projects for this tenant`);
        
        const customerNames = [...new Set(projects.map(p => p.customer))];
        console.log('📋 Current customer names:', customerNames);
        
        // Update all projects to have customer: "Chevron"
        const result = await Project.updateMany(
            { tenantId: tenantId },
            { $set: { customer: "Chevron" } }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} projects to have customer: "Chevron"`);
        
        // Verify the update
        const updatedProjects = await Project.find({ tenantId: tenantId }, { customer: 1, projectname: 1 });
        const updatedCustomerNames = [...new Set(updatedProjects.map(p => p.customer))];
        console.log('📋 Updated customer names:', updatedCustomerNames);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixCustomerNames();
