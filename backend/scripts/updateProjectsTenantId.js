require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const Firm = require('../models/firmModel');

async function updateProjectsTenantId() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Find Chevron firm
    const chevronFirm = await Firm.findOne({ name: 'Chevron' });
    if (!chevronFirm) {
      console.log('❌ Chevron firm not found');
      process.exit(1);
    }
    console.log('📊 Found Chevron firm:', chevronFirm._id);
    
    // Find projects without tenantId
    const projectsWithoutTenant = await Project.find({ 
      customer: 'Chevron', 
      tenantId: { $exists: false } 
    });
    console.log('📊 Chevron projects without tenantId:', projectsWithoutTenant.length);
    
    if (projectsWithoutTenant.length > 0) {
      // Update projects with tenantId
      const result = await Project.updateMany(
        { customer: 'Chevron', tenantId: { $exists: false } },
        { tenantId: chevronFirm._id }
      );
      console.log('✅ Updated projects with tenantId:', result.modifiedCount);
    }
    
    // Verify the update
    const updatedProjects = await Project.find({ 
      customer: 'Chevron', 
      tenantId: chevronFirm._id 
    });
    console.log('📊 Chevron projects with correct tenantId:', updatedProjects.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProjectsTenantId();
