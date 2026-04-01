import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
       await mongoose.connect("mongodb+srv://adiboy6506_db_user:KVLHm3UfRiIdc9xL@cluster0.vjqigob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("mongodb connected");
    } catch(error){
        console.error("Error connecting",error);
    }
}