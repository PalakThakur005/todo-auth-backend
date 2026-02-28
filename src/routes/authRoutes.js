import express from "express"
// const { registerUser, loginUser } = authController;
import {registerUser,loginUser} from "../controllers/authController.js"
const router = express.Router()

router.post("/register" ,registerUser);
router.post("/login" , loginUser)

export default router;