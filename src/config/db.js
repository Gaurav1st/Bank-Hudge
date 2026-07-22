import mongoose from "mongoose";


function connectMongoDb()
{
    mongoose.connect(process.env.DB_URI).then(()=> console.log("MongoDB connceted 🚀")).catch(err => console.log("Mongo Db Connection Error :",err));
}

export default connectMongoDb;