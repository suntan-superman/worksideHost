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

const fixUserFirmAssociation = async () => {
    try {
        await connectDB();
        
        const User = require('../models/userModel');
        const Firm = require('../models/firmModel');
        
        console.log('🔧 Fixing user firm association...');
        
        // Find the Chevron firm
        const chevronFirm = await Firm.findOne({ name: "Chevron" });
        if (!chevronFirm) {
            console.log('❌ Chevron firm not found');
            process.exit(1);
        }
        
        console.log('📊 Found Chevron firm:', chevronFirm._id);
        
        // Update the user to associate with Chevron firm
        const result = await User.updateOne(
            { email: "worksidedemo+chevron@gmail.com" },
            { $set: { firmId: chevronFirm._id } }
        );
        
        console.log(`✅ Updated user firm association: ${result.modifiedCount} user updated`);
        
        // Verify the update
        const updatedUser = await User.findOne({ email: "worksidedemo+chevron@gmail.com" }).populate('firmId');
        console.log('📊 Updated user details:', {
            email: updatedUser.email,
            firmId: updatedUser.firmId._id,
            firmName: updatedUser.firmId.name
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixUserFirmAssociation();
