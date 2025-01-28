import { Router } from "express";
import {userRouter} from "./user.routes.js";
import authRoutes from "./auth.routes.js";
// import viewsRoutes from "./views.routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRoutes);

export default router;
