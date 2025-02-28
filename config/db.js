const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const DB_connect = process.env.DB_URI ; 

exports.connectDB = async () => {
    try {
        await mongoose.connect(DB_connect);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
