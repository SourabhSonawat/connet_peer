import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as profileController from "../controllers/profile.controllers.js";

const profileRouter = express.Router();

profileRouter.get("/view", authenticate, profileController.viewProfile);

profileRouter.patch("/edit", authenticate, profileController.editProfile);

export default profileRouter;
