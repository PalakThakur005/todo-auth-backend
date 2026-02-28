// const registerUser = (req,res)=>{
//     res.send("user register")

// }

//  const loginUser=(req,res)=>{
// res.send(" user login ")
// }

// export default {registerUser,loginUser} ;






import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ✅ REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
if(!name || !email ||!password){
        res.status(500).json({ error: "All Fileds are Required" });

}


    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User Registered Successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};