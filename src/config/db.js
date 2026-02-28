import mongoose from "mongoose";
const connectDB = async () =>{
try{
const conn = await mongoose.connect(process.env.MONGO_URL)
console.log("Database Connected Successfully")
}catch(error){
 console.error(error)
}
}
export default connectDB;