import bcrypt from "bcrypt"
import connectDB from "../config/db.js";
import User from "../models/user.js";


const seedAdmin =async () =>{
    try{
    await connectDB();
    const adminExist = await User.findOne({email:"admin@gmail.com"})
    if(adminExist){
       console.log("Admin already exists" );
        process.exit()
    };
    const hashPassword = await bcrypt.hash("admin@123" , 10)
    await User.create({
        name:"Admin",
        email:"admin@gmail.com",
        password:hashPassword,
        role:"admin"
    });
     console.log("✅ Admin Created Successfully!");
    process.exit();
    }catch(error){
   console.error(error);
   process.exit(1);
    }
}
seedAdmin()