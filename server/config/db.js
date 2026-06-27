const mongoose = require('mongoose');

// Function to connect to MongoDB Atlas
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(`MongoDB Connection Error: ${error.message}`);
        // Exit process with failure if DB connection fails
        process.exit(1); 
    }
};

module.exports = connectDB;