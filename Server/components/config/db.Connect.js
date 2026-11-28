const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/INF243MWA");
        console.log("Successfully connected to MongoDB")
    } catch(error){
        console.error("Error connecting to MongoDB", error.message);
    }
}

module.exports = connectDB;