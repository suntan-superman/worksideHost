require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const Firm = require('../models/firmModel');

async function updateProjectsByCustomer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all unique customers from projects
    const customers = await Project.distinct('customer');
    console.log('📊 Found customers:', customers);
    
    // Get all firms
    const firms = await Firm.find({});
    console.log('📊 Found firms:', firms.length);
    
    let totalUpdated = 0;
    
    for (const customer of customers) {
      if (!customer) continue;
      
      // Find matching firm by name
      const firm = firms.find(f => f.name === customer);
      
      if (firm) {
        console.log(`📊 Mapping ${customer} to firm: ${firm._id}`);
        
        // Update projects for this customer
        const result = await Project.updateMany(
          { 
            customer: customer, 
            tenantId: { $exists: false } 
          },
          { tenantId: firm._id }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} projects for ${customer}`);
        totalUpdated += result.modifiedCount;
      } else {
        console.log(`⚠️  No firm found for customer: ${customer}`);
      }
    }
    
    console.log(`🎉 Total projects updated: ${totalUpdated}`);
    
    // Verify the updates
    const projectsWithTenant = await Project.find({ tenantId: { $exists: true } });
    console.log('📊 Projects with tenantId:', projectsWithTenant.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProjectsByCustomer();
