import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:["admin","teacher","students"],
        default:"students"
    }
},
{timestamps:true}
);
const User= mongoose.model("User" , userSchema)
// now the Data is collection name in mongoDb and userSchema stored inside  the collection name

export default User;