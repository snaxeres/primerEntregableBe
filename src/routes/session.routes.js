import  {userModel}  from "../models/user.model.js";
import { Router } from "express";
import { verifyPassword } from "../utils/hashFunctions.js";
import { createHash } from "../utils/hashFunctions.js";

export const sessionRoutes = Router();

sessionRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    // Compare pass 

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      email: user.email,
    };

    return res.status(200).json({ message: "User logged in" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRoutes.post("/register", async (req, res) => {
  const { first_name, last_name, age, password, email } = req.body;

  if (!first_name || !last_name || !age || !password || !email)
    return res.status(400).json({
      message: "All fields are required",
    });

  try {
    const userExists = await userModel.findOne({ email });

    console.log(userExists);

    if (userExists)
      return res.status(409).json({ message: "User already exists" });

    //hash password

 const hashedPassword = await createHash(password)

    const user = await userModel.create({
      first_name,
      last_name,
      age,
      password: hashedPassword,
      email,
    });

    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

sessionRoutes.get("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).json({ message: "User logged out" });
});
