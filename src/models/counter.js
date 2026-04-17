import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: String,
  seq: Number
});

export const Counter = mongoose.model("Counter", counterSchema);