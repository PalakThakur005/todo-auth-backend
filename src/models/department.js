// models/Department.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,

    },status:{
      type:String,
      enum:["active","inactive"],
      default:"active"
    }
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);