require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');

async function checkProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    const totalProjects = await Project.countDocuments();
    console.log('📊 Total projects:', totalProjects);
    
    const chevronProjects = await Project.find({ customer: 'Chevron' });
    console.log('📊 Chevron projects:', chevronProjects.length);
    
    const projectsWithTenant = await Project.find({ tenantId: { $exists: true } });
    console.log('📊 Projects with tenantId:', projectsWithTenant.length);
    
    if (chevronProjects.length > 0) {
      console.log('📊 Sample Chevron project:', {
        id: chevronProjects[0]._id,
        customer: chevronProjects[0].customer,
        tenantId: chevronProjects[0].tenantId,
        projectname: chevronProjects[0].projectname
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProjects();
