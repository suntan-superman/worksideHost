require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');
const Firm = require('./models/firmModel');

async function addTenantId() {
  try {
    console.log('🔄 Starting tenantId update...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Get all projects without tenantId
    const projectsWithoutTenant = await Project.find({ tenantId: { $exists: false } });
    console.log(`📊 Found ${projectsWithoutTenant.length} projects without tenantId`);
    
    if (projectsWithoutTenant.length === 0) {
      console.log('✅ All projects already have tenantId');
      process.exit(0);
    }
    
    // Get all firms
    const firms = await Firm.find({});
    console.log(`📊 Found ${firms.length} firms`);
    
    let updated = 0;
    
    // Process each project
    for (const project of projectsWithoutTenant) {
      if (!project.customer) continue;
      
      // Find matching firm by name
      const firm = firms.find(f => f.name === project.customer);
      
      if (firm) {
        await Project.updateOne(
          { _id: project._id },
          { tenantId: firm._id }
        );
        updated++;
        console.log(`✅ Updated project "${project.projectname}" for customer "${project.customer}"`);
      } else {
        console.log(`⚠️  No firm found for customer: "${project.customer}"`);
      }
    }
    
    console.log(`🎉 Updated ${updated} projects with tenantId`);
    
    // Verify
    const projectsWithTenant = await Project.find({ tenantId: { $exists: true } });
    console.log(`📊 Total projects with tenantId: ${projectsWithTenant.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTenantId();
