const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sroy:l8dUBdRiajc8CYkG@cluster0.btnh8k6.mongodb.net/client");
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const fixChevronTenantId = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        const correctTenantId = '65423d5c240388c1594e7b79';
        
        console.log('🔧 Fixing tenantId for Chevron projects...');
        
        // Find all Chevron projects
        const chevronProjects = await Project.find({ customer: "Chevron" });
        console.log(`📊 Found ${chevronProjects.length} Chevron projects`);
        
        // Update all Chevron projects to have the correct tenantId
        const result = await Project.updateMany(
            { customer: "Chevron" },
            { $set: { tenantId: correctTenantId } }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} Chevron projects to have tenantId: ${correctTenantId}`);
        
        // Verify the update
        const updatedChevronProjects = await Project.find({ 
            customer: "Chevron", 
            tenantId: correctTenantId 
        });
        console.log(`📊 Chevron projects with correct tenantId: ${updatedChevronProjects.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixChevronTenantId();
