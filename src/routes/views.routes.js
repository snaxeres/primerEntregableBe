import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  if (!req.cookies.currentUser) {
    res.render("login");
  } else {
    res.redirect("/current");
  }
});

router.get("/register", (req, res) => {
  const isSession = req.session.user ? true : false;

  if (isSession) {
    return res.redirect("/");
  }

  res.render("register", { title: "Register" });
});

router.get("/current", authenticate, (req, res) => {
  if (req.user) {
    res.render("current", { user: req.user });
  } else {
    res.redirect("/");
  }
});

export default router;
