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

const checkCustomerNames = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        const tenantId = '65423d5c240388c1594e7b79';
        
        console.log('🔍 Checking customer names for tenant:', tenantId);
        
        const projects = await Project.find({ tenantId: tenantId }, { customer: 1, projectname: 1 });
        
        console.log(`📊 Found ${projects.length} projects for this tenant:`);
        
        const customerNames = [...new Set(projects.map(p => p.customer))];
        console.log('📋 Unique customer names:');
        customerNames.forEach((name, index) => {
            console.log(`${index + 1}. "${name}"`);
        });
        
        console.log('\n🔍 Looking for projects with customer containing "Chevron":');
        const chevronProjects = await Project.find({ 
            tenantId: tenantId,
            customer: { $regex: /chevron/i }
        }, { customer: 1, projectname: 1 });
        
        console.log(`Found ${chevronProjects.length} projects with "Chevron" in customer name:`);
        chevronProjects.forEach(p => {
            console.log(`- Customer: "${p.customer}", Project: "${p.projectname}"`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkCustomerNames();