const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://sroy:l8dUBdRiajc8CYkG@cluster0.btnh8k6.mongodb.net/client");
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const createChevronProjects = async () => {
    try {
        await connectDB();
        
        const Project = require('../models/projectModel');
        const tenantId = '65423d5c240388c1594e7b79';
        
        console.log('🔧 Creating Chevron projects...');
        
        const chevronProjects = [
            {
                customer: "Chevron",
                projectname: "Stugart #01N Stimulation 2025",
                description: "Frac Job",
                projectedstartdate: new Date("2025-04-10T07:00:00.000Z"),
                expectedduration: 8,
                status: "ACTIVE",
                area: "MID-CONTINENT",
                customercontact: "worksidedemo+chevron@gmail.com",
                rigcompany: "ENSIGN",
                latdec: 40.38686,
                longdec: -104.80576,
                tenantId: tenantId
            },
            {
                customer: "Chevron",
                projectname: "Ridge State #21N Stimulation 2025",
                description: "Frac Job",
                projectedstartdate: new Date("2025-04-10T07:00:00.000Z"),
                expectedduration: 8,
                status: "ACTIVE",
                area: "MID-CONTINENT",
                customercontact: "worksidedemo+chevron@gmail.com",
                rigcompany: "ENSIGN",
                latdec: 40.39478,
                longdec: -104.81072,
                tenantId: tenantId
            },
            {
                customer: "Chevron",
                projectname: "Sanford #03N Stimulation 2025",
                description: "Frac Job",
                projectedstartdate: new Date("2025-04-15T07:00:00.000Z"),
                expectedduration: 8,
                status: "ACTIVE",
                area: "MID-CONTINENT",
                customercontact: "worksidedemo+chevron@gmail.com",
                rigcompany: "ENSIGN",
                latdec: 40.37591,
                longdec: -104.80491,
                tenantId: tenantId
            },
            {
                customer: "Chevron",
                projectname: "Bost Farm #39N-8B-L Stimulation 2025",
                description: "Frac Job",
                projectedstartdate: new Date("2025-04-16T07:00:00.000Z"),
                expectedduration: 9,
                status: "PENDING",
                area: "MID-CONTINENT",
                customercontact: "worksidedemo+chevron@gmail.com",
                rigcompany: "ENSIGN",
                latdec: 40.41464,
                longdec: -104.82822,
                tenantId: tenantId
            }
        ];
        
        // Check if Chevron projects already exist
        const existingChevronProjects = await Project.find({ customer: "Chevron" });
        console.log(`📊 Found ${existingChevronProjects.length} existing Chevron projects`);
        
        if (existingChevronProjects.length === 0) {
            // Create the Chevron projects
            const result = await Project.insertMany(chevronProjects);
            console.log(`✅ Created ${result.length} Chevron projects`);
        } else {
            console.log('ℹ️ Chevron projects already exist, skipping creation');
        }
        
        // Verify the projects exist
        const finalChevronProjects = await Project.find({ customer: "Chevron" });
        console.log(`📊 Total Chevron projects in database: ${finalChevronProjects.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createChevronProjects();
