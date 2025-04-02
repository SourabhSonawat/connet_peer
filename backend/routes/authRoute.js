import express from "express";
import { SignUp, Login, Logout } from "../controllers/auth.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
