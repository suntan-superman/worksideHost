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

const findChevronProjects = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        
        console.log('🔍 Searching for ALL projects with customer "Chevron" in the entire database...');
        
        // Search for projects with customer "Chevron" (case-insensitive)
        const chevronProjects = await Project.find({ 
            customer: { $regex: /chevron/i }
        });
        
        console.log(`📊 Found ${chevronProjects.length} projects with "Chevron" in customer name:`);
        chevronProjects.forEach((project, index) => {
            console.log(`${index + 1}. Customer: "${project.customer}", Project: "${project.projectname}", TenantId: ${project.tenantId}`);
        });
        
        // Also search for exact match
        const exactChevronProjects = await Project.find({ customer: "Chevron" });
        console.log(`\n📊 Found ${exactChevronProjects.length} projects with exact customer "Chevron":`);
        exactChevronProjects.forEach((project, index) => {
            console.log(`${index + 1}. Customer: "${project.customer}", Project: "${project.projectname}", TenantId: ${project.tenantId}`);
        });
        
        // Show all unique customer names in the entire database
        const allProjects = await Project.find({}, { customer: 1 });
        const allCustomerNames = [...new Set(allProjects.map(p => p.customer))];
        console.log(`\n📋 All customer names in database (${allCustomerNames.length} total):`);
        allCustomerNames.forEach((name, index) => {
            console.log(`${index + 1}. "${name}"`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

findChevronProjects();
