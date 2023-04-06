const mongoose = require('mongoose');
// import mongoose from "mongoose";
async function connectDB() {
    try {
    const MONGO_URI = "Your MongoDB URI";
    mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log("Connected to MongoDB");
    }catch(err) {
        console.log(err)  
    }
}
module.exports = connectDB;