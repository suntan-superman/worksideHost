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

const checkChevronTenantIds = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        
        console.log('🔍 Checking tenantIds for Chevron projects...');
        
        // Find all projects with customer "Chevron"
        const chevronProjects = await Project.find({ customer: "Chevron" });
        
        console.log(`📊 Found ${chevronProjects.length} projects with customer "Chevron":`);
        chevronProjects.forEach((project, index) => {
            console.log(`${index + 1}. Customer: "${project.customer}", Project: "${project.projectname}", TenantId: ${project.tenantId}`);
        });
        
        // Check what tenantId the current user is using
        const currentTenantId = '65423d5c240388c1594e7b79';
        console.log(`\n🔍 Current user's tenantId: ${currentTenantId}`);
        
        // Check if any Chevron projects have the current tenantId
        const chevronProjectsWithCurrentTenant = await Project.find({ 
            customer: "Chevron", 
            tenantId: currentTenantId 
        });
        
        console.log(`📊 Chevron projects with current tenantId: ${chevronProjectsWithCurrentTenant.length}`);
        
        // Show all unique tenantIds for Chevron projects
        const chevronTenantIds = [...new Set(chevronProjects.map(p => p.tenantId.toString()))];
        console.log(`\n📋 Unique tenantIds for Chevron projects: ${chevronTenantIds.join(', ')}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkChevronTenantIds();
