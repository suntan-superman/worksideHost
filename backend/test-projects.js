require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');

async function testProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    // Check all Chevron projects
    const allChevronProjects = await Project.find({ customer: 'Chevron' });
    console.log('📊 All Chevron projects:', allChevronProjects.length);
    
    if (allChevronProjects.length > 0) {
      console.log('📊 Sample project:', {
        id: allChevronProjects[0]._id,
        customer: allChevronProjects[0].customer,
        tenantId: allChevronProjects[0].tenantId,
        projectname: allChevronProjects[0].projectname
      });
    }
    
    // Check projects with tenantId
    const projectsWithTenant = await Project.find({ 
      customer: 'Chevron', 
      tenantId: { $exists: true } 
    });
    console.log('📊 Chevron projects with tenantId:', projectsWithTenant.length);
    
    // Check the specific tenantId we're looking for
    const specificTenantProjects = await Project.find({ 
      customer: 'Chevron', 
      tenantId: '65423d5c240388c1594e7b79' 
    });
    console.log('📊 Chevron projects with specific tenantId:', specificTenantProjects.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testProjects();
