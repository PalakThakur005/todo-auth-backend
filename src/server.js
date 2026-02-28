import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log("DB Error:", err));
connectDb();

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// connect Route
app.use("/auth",authRoutes)
app.use("/todo" , todoRoutes)

// Start Server

app.listen(5000, () => {
  console.log(`Server started on port 5000`);
});