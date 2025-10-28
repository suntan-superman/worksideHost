require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/projectModel');
const Firm = require('./models/firmModel');

async function fixProjects() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');
    
    const chevronFirm = await Firm.findOne({ name: 'Chevron' });
    console.log('📊 Chevron firm ID:', chevronFirm._id);
    
    const result = await Project.updateMany(
      { customer: 'Chevron', tenantId: { $exists: false } }, 
      { tenantId: chevronFirm._id }
    );
    console.log('✅ Updated projects:', result.modifiedCount);
    
    const updatedProjects = await Project.find({ 
      customer: 'Chevron', 
      tenantId: chevronFirm._id 
    });
    console.log('📊 Total Chevron projects with tenantId:', updatedProjects.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixProjects();
