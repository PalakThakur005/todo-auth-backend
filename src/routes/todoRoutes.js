import express from "express"
import { protect } from "../middlewares/authController.js";
import { createTodo,getTodo } from "../controllers/todoController.js";

const router = express.Router();

router.post("/" ,protect, createTodo)
router.get("/" ,protect, getTodo)

export default router;