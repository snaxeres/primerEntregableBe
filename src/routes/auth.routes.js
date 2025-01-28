// import { Router } from "express";
// import passport from "passport";

// export const authRouter = Router();

// authRouter.post(
//   "/register",
//   passport.authenticate("register", { session: false }),
//   (req, res) => {
//     res.json(req.user);
//   }
// );

// authRouter.post(
//   "/login",
//   passport.authenticate("login", { session: false }),
//   (req, res) => {
//     const token = req.token;

//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     });

//     res.json({ token });
//   }
// );

import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", authController.login);

export default router;
