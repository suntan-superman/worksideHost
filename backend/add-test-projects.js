require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');
const Firm = require('./models/firmModel');

async function addTestProjects() {
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
    
    // Check if projects already exist
    const existingProjects = await Project.find({ customer: 'Chevron' });
    console.log('📊 Existing Chevron projects:', existingProjects.length);
    
    if (existingProjects.length === 0) {
      // Add test projects
      const testProjects = [
        {
          projectname: 'Chevron Test Project 1',
          customer: 'Chevron',
          tenantId: chevronFirm._id,
          status: 'ACTIVE',
          area: 'WEST COAST',
          projectedstartdate: new Date(),
          projectedenddate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        },
        {
          projectname: 'Chevron Test Project 2',
          customer: 'Chevron',
          tenantId: chevronFirm._id,
          status: 'ACTIVE',
          area: 'WEST COAST',
          projectedstartdate: new Date(),
          projectedenddate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
        }
      ];
      
      const createdProjects = await Project.insertMany(testProjects);
      console.log('✅ Created test projects:', createdProjects.length);
    } else {
      // Update existing projects with tenantId if missing
      const projectsWithoutTenant = await Project.find({ 
        customer: 'Chevron', 
        tenantId: { $exists: false } 
      });
      
      if (projectsWithoutTenant.length > 0) {
        await Project.updateMany(
          { customer: 'Chevron', tenantId: { $exists: false } },
          { tenantId: chevronFirm._id }
        );
        console.log('✅ Updated projects with tenantId');
      }
    }
    
    // Verify projects
    const finalProjects = await Project.find({ customer: 'Chevron' });
    console.log('📊 Final Chevron projects:', finalProjects.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addTestProjects();
