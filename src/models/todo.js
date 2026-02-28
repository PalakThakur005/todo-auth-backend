import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
     {
        user:{
          type:  mongoose.Schema.Types.ObjectId,
          ref:"User"
        },
    title:{
        type: String
    },
    description:{
        type: String
    },
    completed: { 
        type: Boolean,
         default: false
         },
  },
  { timestamps: true }

)
  export const Todo = mongoose.model("Todo" , todoSchema)
