import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

 export const  Book = mongoose.model("Book" , bookSchema);