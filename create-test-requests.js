const mongoose = require('mongoose');
const Request = require('./models/requestModel');
const Project = require('./models/projectModel');
const { User } = require('./models/userModel');

// Connect to database
async function createTestRequests() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to database');
        
        // Get Chevron user and projects
        const user = await User.findOne({ email: 'worksidedemo+chevron@gmail.com' }).populate('firmId');
        if (!user) {
            console.log('❌ Chevron user not found');
            return;
        }
        
        console.log('✅ Found user:', user.firstName, user.lastName);
        console.log('✅ User firm:', user.firmId.name);
        
        const projects = await Project.find({ customer: 'Chevron', tenantId: user.firmId._id });
        console.log('✅ Found', projects.length, 'Chevron projects');
        
        if (projects.length === 0) {
            console.log('❌ No Chevron projects found');
            return;
        }
        
        // Create test requests for each project
        const testRequests = [
            {
                description: 'Frac Fluid Delivery',
                status: 'PENDING',
                priority: 'HIGH',
                category: 'Fluid Services'
            },
            {
                description: 'Coiled Tubing Services',
                status: 'ACTIVE',
                priority: 'MEDIUM',
                category: 'Tubing Services'
            },
            {
                description: 'Cementing Services',
                status: 'PENDING',
                priority: 'HIGH',
                category: 'Cementing'
            }
        ];
        
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            console.log(`\n📝 Creating requests for project: ${project.projectname}`);
            
            for (let j = 0; j < testRequests.length; j++) {
                const requestData = testRequests[j];
                
                const request = new Request({
                    project_id: project._id,
                    customer: project.customer,
                    description: `${requestData.description} - ${project.projectname}`,
                    status: requestData.status,
                    priority: requestData.priority,
                    category: requestData.category,
                    datetimerequested: new Date(),
                    tenantId: user.firmId._id, // CRITICAL: Add tenantId
                    createdBy: user._id
                });
                
                await request.save();
                console.log(`✅ Created request: ${request.description}`);
            }
        }
        
        console.log('\n🎉 Test requests created successfully!');
        
        // Verify requests were created
        const totalRequests = await Request.find({ tenantId: user.firmId._id });
        console.log(`📊 Total requests in database: ${totalRequests.length}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createTestRequests();
